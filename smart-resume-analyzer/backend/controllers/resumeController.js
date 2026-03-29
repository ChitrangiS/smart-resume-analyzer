const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { extractTextFromFile } = require("../utils/textExtractor");
const { analyzeResume } = require("../utils/analyzer");
const Resume = require("../models/Resume");
const skillsDataset = require("../data/skillsDataset");

/**
 * POST /api/resume/upload
 * Upload and analyze a resume
 */
exports.uploadAndAnalyze = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const { role } = req.body;
  if (!role || !skillsDataset[role]) {
    return res.status(400).json({ success: false, message: "Invalid or missing job role" });
  }

  try {
    // Extract text
    const resumeText = await extractTextFromFile(req.file.path);

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(422).json({
        success: false,
        message: "Could not extract enough text from the file. Please ensure it is not a scanned image.",
      });
    }

    // Analyze
    const analysis = analyzeResume(resumeText, role);

    // Save to DB
    const resumeDoc = new Resume({
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileType: path.extname(req.file.originalname).toLowerCase().replace(".", ""),
      fileSize: req.file.size,
      resumeText: resumeText.slice(0, 10000), // cap stored text
      ...analysis,
    });

    await resumeDoc.save();

    // Clean up uploaded file
    fs.unlink(req.file.path, () => {});

    res.json({
      success: true,
      message: "Resume analyzed successfully",
      data: {
        id: resumeDoc._id,
        ...analysis,
        originalName: req.file.originalname,
        fileType: resumeDoc.fileType,
        fileSize: req.file.size,
        createdAt: resumeDoc.createdAt,
      },
    });
  } catch (err) {
    // Clean up on error
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    console.error("Analysis error:", err);
    res.status(500).json({ success: false, message: err.message || "Analysis failed" });
  }
};

/**
 * GET /api/resume/:id
 * Fetch a stored analysis by ID
 */
exports.getAnalysis = async (req, res) => {
  try {
    const doc = await Resume.findById(req.params.id).select("-resumeText");
    if (!doc) {
      return res.status(404).json({ success: false, message: "Analysis not found" });
    }
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/resume/history
 * Get recent analyses
 */
exports.getHistory = async (req, res) => {
  try {
    const docs = await Resume.find()
      .select("-resumeText -wordFrequency -sections -scoreBreakdown")
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/roles
 * Return available roles
 */
exports.getRoles = (req, res) => {
  const roles = Object.entries(skillsDataset).map(([key, val]) => ({
    key,
    title: val.title,
    coreSkillCount: val.coreSkills.length,
    advancedSkillCount: val.advancedSkills.length,
    softSkillCount: val.softSkills.length,
  }));
  res.json({ success: true, data: roles });
};

/**
 * DELETE /api/resume/:id
 */
exports.deleteAnalysis = async (req, res) => {
  try {
    await Resume.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
