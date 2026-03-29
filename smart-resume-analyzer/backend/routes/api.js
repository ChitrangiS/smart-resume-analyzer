const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  uploadAndAnalyze,
  getAnalysis,
  getHistory,
  getRoles,
  deleteAnalysis,
} = require("../controllers/resumeController");

router.get("/roles", getRoles);
router.post("/resume/upload", upload.single("resume"), uploadAndAnalyze);
router.get("/resume/history", getHistory);
router.get("/resume/:id", getAnalysis);
router.delete("/resume/:id", deleteAnalysis);

module.exports = router;
