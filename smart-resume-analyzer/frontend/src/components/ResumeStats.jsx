import React from "react";
import "./ResumeStats.css";

const SECTION_ICONS = {
  summary: "📝",
  experience: "💼",
  education: "🎓",
  skills: "⚙️",
  projects: "🚀",
  certifications: "🏅",
  achievements: "🏆",
};

export default function ResumeStats({ wordCount, characterCount, sections, wordFrequency, originalName, fileType }) {
  const detectedSections = Object.entries(sections || {}).filter(([, v]) => v);
  const missingSections = Object.entries(sections || {}).filter(([, v]) => !v);
  const topWords = (wordFrequency || []).slice(0, 10);

  return (
    <div className="stats-grid">
      {/* File info */}
      <div className="stat-card">
        <div className="stat-card__label">Document</div>
        <div className="stat-card__filename">{originalName}</div>
        <div className="stat-card__meta">
          <span className="stat-badge">{fileType?.toUpperCase()}</span>
          <span className="stat-card__sub">{wordCount?.toLocaleString()} words</span>
          <span className="stat-card__sub">{characterCount?.toLocaleString()} chars</span>
        </div>
      </div>

      {/* Sections */}
      <div className="stat-card span-2">
        <div className="stat-card__label">Resume Sections</div>
        <div className="sections-grid">
          {Object.entries(sections || {}).map(([key, present]) => (
            <div key={key} className={`section-chip ${present ? "present" : "absent"}`}>
              <span>{SECTION_ICONS[key]}</span>
              <span className="section-chip__name">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <span className="section-chip__status">{present ? "✓" : "✗"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top keywords */}
      <div className="stat-card span-full">
        <div className="stat-card__label">Top Keywords in Resume</div>
        <div className="keyword-bars">
          {topWords.map((item, i) => {
            const maxCount = topWords[0]?.count || 1;
            const pct = (item.count / maxCount) * 100;
            return (
              <div key={item.word} className="keyword-bar" style={{ animationDelay: `${i * 0.04}s` }}>
                <span className="keyword-bar__word">{item.word}</span>
                <div className="keyword-bar__track">
                  <div
                    className="keyword-bar__fill"
                    style={{ "--target-width": `${pct}%` }}
                  />
                </div>
                <span className="keyword-bar__count">{item.count}×</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
