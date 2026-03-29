const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema({
  priority: { type: String, enum: ["high", "medium", "low"] },
  category: String,
  message: String,
});

const scoreBreakdownSchema = new mongoose.Schema({
  core: { matched: Number, total: Number, weight: String },
  advanced: { matched: Number, total: Number, weight: String },
  soft: { matched: Number, total: Number, weight: String },
});

const resumeSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    fileType: String,
    fileSize: Number,
    role: String,
    roleKey: String,
    resumeText: String,
    wordCount: Number,
    characterCount: Number,
    atsScore: { type: Number, min: 0, max: 100 },
    scoreBreakdown: scoreBreakdownSchema,
    foundSkills: [String],
    missingSkills: [String],
    totalRoleSkills: Number,
    sections: {
      summary: Boolean,
      experience: Boolean,
      education: Boolean,
      skills: Boolean,
      projects: Boolean,
      certifications: Boolean,
      achievements: Boolean,
    },
    suggestions: [suggestionSchema],
    wordFrequency: [{ word: String, count: Number }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
