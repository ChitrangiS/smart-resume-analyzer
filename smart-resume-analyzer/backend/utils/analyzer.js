const skillsDataset = require("../data/skillsDataset");

// Common stop words to filter out
const STOP_WORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with",
  "by","from","as","is","was","are","were","be","been","being","have","has",
  "had","do","does","did","will","would","could","should","may","might",
  "shall","can","need","dare","ought","used","am","it","its","this","that",
  "these","those","i","me","my","myself","we","our","ours","ourselves","you",
  "your","yours","yourself","yourselves","he","him","his","himself","she",
  "her","hers","herself","they","them","their","theirs","themselves","what",
  "which","who","whom","whose","when","where","why","how","all","both",
  "each","every","few","more","most","other","some","such","no","not",
  "only","own","same","so","than","too","very","just","because","if",
  "while","although","though","however","therefore","thus","hence",
  "also","both","either","neither","nor","whether","even","still","yet",
  "well","up","out","about","above","after","before","between","during",
  "since","until","within","along","through","throughout","upon","across",
  "behind","beyond","plus","except","up","over","then","once","here",
  "there","again","further","next","last","new","old","good","best"
]);

/**
 * Normalize text to lowercase tokens, filter stop words
 */
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9#+.\s/-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

/**
 * Build n-grams from tokens (up to 3-word phrases)
 */
function buildNgrams(tokens, maxN = 3) {
  const ngrams = new Set(tokens);
  for (let n = 2; n <= maxN; n++) {
    for (let i = 0; i <= tokens.length - n; i++) {
      ngrams.add(tokens.slice(i, i + n).join(" "));
    }
  }
  return ngrams;
}

/**
 * Extract skills from resume text for a given role
 */
function extractSkills(resumeText, role) {
  const roleData = skillsDataset[role];
  if (!roleData) throw new Error(`Unknown role: ${role}`);

  const allRoleSkills = [
    ...roleData.coreSkills,
    ...roleData.advancedSkills,
    ...roleData.softSkills,
  ];

  const tokens = tokenize(resumeText);
  const ngrams = buildNgrams(tokens);

  const found = [];
  const missing = [];

  for (const skill of allRoleSkills) {
    const skillLower = skill.toLowerCase();
    if (ngrams.has(skillLower)) {
      found.push(skill);
    } else {
      missing.push(skill);
    }
  }

  return { found, missing, allRoleSkills };
}

/**
 * Compute ATS score as percentage of core skills matched
 */
function computeATSScore(resumeText, role) {
  const roleData = skillsDataset[role];
  if (!roleData) throw new Error(`Unknown role: ${role}`);

  const tokens = tokenize(resumeText);
  const ngrams = buildNgrams(tokens);

  // Weight: core skills 60%, advanced 30%, soft 10%
  const weights = { core: 0.6, advanced: 0.3, soft: 0.1 };

  const coreMatched = roleData.coreSkills.filter((s) => ngrams.has(s.toLowerCase())).length;
  const advancedMatched = roleData.advancedSkills.filter((s) => ngrams.has(s.toLowerCase())).length;
  const softMatched = roleData.softSkills.filter((s) => ngrams.has(s.toLowerCase())).length;

  const coreScore = (coreMatched / roleData.coreSkills.length) * weights.core;
  const advancedScore = (advancedMatched / roleData.advancedSkills.length) * weights.advanced;
  const softScore = (softMatched / roleData.softSkills.length) * weights.soft;

  const totalScore = Math.round((coreScore + advancedScore + softScore) * 100);

  return {
    score: Math.min(totalScore, 100),
    breakdown: {
      core: { matched: coreMatched, total: roleData.coreSkills.length, weight: "60%" },
      advanced: { matched: advancedMatched, total: roleData.advancedSkills.length, weight: "30%" },
      soft: { matched: softMatched, total: roleData.softSkills.length, weight: "10%" },
    },
  };
}

/**
 * Extract word frequency map from resume
 */
function getWordFrequency(resumeText) {
  const tokens = tokenize(resumeText);
  const freq = {};
  tokens.forEach((t) => { freq[t] = (freq[t] || 0) + 1; });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, count]) => ({ word, count }));
}

/**
 * Detect resume sections
 */
function detectSections(resumeText) {
  const sectionKeywords = {
    summary: /\b(summary|objective|profile|about me)\b/i,
    experience: /\b(experience|work history|employment|career)\b/i,
    education: /\b(education|academic|qualification|degree|university|college)\b/i,
    skills: /\b(skills|technologies|tools|competencies|expertise)\b/i,
    projects: /\b(projects|portfolio|work samples)\b/i,
    certifications: /\b(certifications|certificates|licenses|credentials)\b/i,
    achievements: /\b(achievements|awards|honors|accomplishments)\b/i,
  };

  const detected = {};
  for (const [section, regex] of Object.entries(sectionKeywords)) {
    detected[section] = regex.test(resumeText);
  }
  return detected;
}

/**
 * Generate improvement suggestions based on analysis
 */
function generateSuggestions(resumeText, role, atsScore, foundSkills, missingSk, sections) {
  const suggestions = [];

  // ATS score based
  if (atsScore < 40) {
    suggestions.push({
      priority: "high",
      category: "ATS Score",
      message: `Your ATS score is low (${atsScore}%). Add significantly more role-specific keywords from the ${skillsDataset[role].title} skill set.`,
    });
  } else if (atsScore < 65) {
    suggestions.push({
      priority: "medium",
      category: "ATS Score",
      message: `Moderate ATS score (${atsScore}%). Add more technical keywords to improve shortlisting chances.`,
    });
  } else {
    suggestions.push({
      priority: "low",
      category: "ATS Score",
      message: `Good ATS score (${atsScore}%). Keep refining keyword alignment with job descriptions.`,
    });
  }

  // Missing critical skills
  const roleData = skillsDataset[role];
  const missingCore = missingSk.filter((s) => roleData.coreSkills.includes(s));
  if (missingCore.length > 0) {
    suggestions.push({
      priority: "high",
      category: "Core Skills Gap",
      message: `You are missing ${missingCore.length} core skill(s): ${missingCore.slice(0, 5).join(", ")}${missingCore.length > 5 ? "..." : ""}. These are essential for this role.`,
    });
  }

  // Section checks
  if (!sections.summary) {
    suggestions.push({
      priority: "high",
      category: "Missing Section",
      message: "Add a professional Summary or Objective section at the top of your resume.",
    });
  }
  if (!sections.experience) {
    suggestions.push({
      priority: "high",
      category: "Missing Section",
      message: "Include a Work Experience section with concrete accomplishments and metrics.",
    });
  }
  if (!sections.skills) {
    suggestions.push({
      priority: "medium",
      category: "Missing Section",
      message: "Add a dedicated Skills section to help ATS parse your technical competencies.",
    });
  }
  if (!sections.projects) {
    suggestions.push({
      priority: "medium",
      category: "Missing Section",
      message: "Include a Projects section showcasing relevant work with tech stacks used.",
    });
  }
  if (!sections.certifications) {
    suggestions.push({
      priority: "low",
      category: "Certifications",
      message: "Consider adding relevant certifications (AWS, GCP, etc.) to boost credibility.",
    });
  }

  // Resume length check
  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
  if (wordCount < 200) {
    suggestions.push({
      priority: "high",
      category: "Resume Length",
      message: "Your resume appears very short. Aim for 400–700 words for entry-level or 600–900 for senior positions.",
    });
  } else if (wordCount > 1200) {
    suggestions.push({
      priority: "medium",
      category: "Resume Length",
      message: "Your resume may be too long. Try to keep it to 1–2 pages for most roles.",
    });
  }

  // Quantification hint
  const hasNumbers = /\d+%|\d+ (years?|months?|projects?|people|clients?|systems?|services?)/i.test(resumeText);
  if (!hasNumbers) {
    suggestions.push({
      priority: "medium",
      category: "Impact Metrics",
      message: 'Quantify your achievements (e.g., "Improved performance by 40%", "Led a team of 8").',
    });
  }

  // Action verb check
  const actionVerbs = ["led","built","developed","designed","implemented","optimized","delivered","launched","managed","created","architected","scaled"];
  const hasActionVerbs = actionVerbs.some((v) => new RegExp(`\\b${v}\\b`, "i").test(resumeText));
  if (!hasActionVerbs) {
    suggestions.push({
      priority: "low",
      category: "Language",
      message: "Use strong action verbs (Led, Built, Delivered, Optimized) to describe your experience.",
    });
  }

  return suggestions.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });
}

/**
 * Main analysis function
 */
function analyzeResume(resumeText, role) {
  const { found, missing, allRoleSkills } = extractSkills(resumeText, role);
  const { score, breakdown } = computeATSScore(resumeText, role);
  const wordFrequency = getWordFrequency(resumeText);
  const sections = detectSections(resumeText);
  const suggestions = generateSuggestions(resumeText, role, score, found, missing, sections);

  const roleData = skillsDataset[role];

  return {
    role: roleData.title,
    roleKey: role,
    atsScore: score,
    scoreBreakdown: breakdown,
    foundSkills: found,
    missingSkills: missing,
    totalRoleSkills: allRoleSkills.length,
    wordFrequency,
    sections,
    suggestions,
    wordCount: resumeText.split(/\s+/).filter(Boolean).length,
    characterCount: resumeText.length,
  };
}

module.exports = { analyzeResume, extractSkills, computeATSScore };
