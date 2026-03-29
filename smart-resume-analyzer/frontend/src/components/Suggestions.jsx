import React, { useState } from "react";
import "./Suggestions.css";

const PRIORITY_CONFIG = {
  high: { label: "High Priority", color: "var(--red)", bg: "var(--red-dim)", border: "rgba(248,113,113,0.25)", icon: "⚠" },
  medium: { label: "Medium", color: "var(--yellow)", bg: "var(--yellow-dim)", border: "rgba(251,191,36,0.25)", icon: "◆" },
  low: { label: "Low", color: "var(--blue)", bg: "var(--blue-dim)", border: "rgba(96,165,250,0.25)", icon: "●" },
};

export default function Suggestions({ suggestions }) {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? suggestions : suggestions.filter(s => s.priority === filter);
  const counts = { high: 0, medium: 0, low: 0 };
  suggestions.forEach(s => counts[s.priority]++);

  return (
    <div className="suggestions">
      <div className="suggestions__header">
        <h3 className="suggestions__title">
          <span className="suggestions__title-icon">💡</span>
          Improvement Suggestions
        </h3>
        <div className="suggestions__filters">
          {["all", "high", "medium", "low"].map(f => (
            <button
              key={f}
              className={`sug-filter ${filter === f ? "active" : ""} ${f !== "all" ? f : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? `All (${suggestions.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${counts[f]})`}
            </button>
          ))}
        </div>
      </div>

      <div className="suggestions__list">
        {filtered.length === 0 ? (
          <p className="suggestions__empty">No suggestions in this category.</p>
        ) : (
          filtered.map((s, i) => {
            const cfg = PRIORITY_CONFIG[s.priority];
            return (
              <div
                key={i}
                className="suggestion-item"
                style={{
                  borderLeft: `3px solid ${cfg.color}`,
                  animationDelay: `${i * 0.06}s`,
                }}
              >
                <div className="suggestion-item__meta">
                  <span
                    className="suggestion-item__priority"
                    style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
                  >
                    {cfg.icon} {cfg.label}
                  </span>
                  <span className="suggestion-item__category">{s.category}</span>
                </div>
                <p className="suggestion-item__message">{s.message}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
