import React, { useState } from "react";
import "./SkillsPanel.css";

export default function SkillsPanel({ foundSkills, missingSkills }) {
  const [tab, setTab] = useState("found");

  const skills = tab === "found" ? foundSkills : missingSkills;
  const colors = tab === "found"
    ? { bg: "var(--accent-dim)", border: "var(--accent-border)", text: "var(--accent)" }
    : { bg: "var(--red-dim)", border: "rgba(248,113,113,0.3)", text: "var(--red)" };

  return (
    <div className="skills-panel">
      <div className="skills-panel__header">
        <button
          className={`skills-tab ${tab === "found" ? "active" : ""}`}
          onClick={() => setTab("found")}
        >
          <span className="skills-tab__dot found" />
          Found <span className="skills-tab__count">{foundSkills.length}</span>
        </button>
        <button
          className={`skills-tab ${tab === "missing" ? "active missing" : ""}`}
          onClick={() => setTab("missing")}
        >
          <span className="skills-tab__dot missing" />
          Missing <span className="skills-tab__count">{missingSkills.length}</span>
        </button>
      </div>

      <div className="skills-panel__grid">
        {skills.length === 0 ? (
          <p className="skills-panel__empty">
            {tab === "found" ? "No matching skills detected." : "All skills found! Great work."}
          </p>
        ) : (
          skills.map((skill, i) => (
            <span
              key={skill}
              className="skill-chip"
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                color: colors.text,
                animationDelay: `${i * 0.03}s`,
              }}
            >
              {skill}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
