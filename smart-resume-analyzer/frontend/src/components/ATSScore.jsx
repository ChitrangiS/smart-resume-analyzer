import React, { useEffect, useState } from "react";
import "./ATSScore.css";

function getScoreLabel(score) {
  if (score >= 80) return { label: "Excellent", color: "#6ee7b7" };
  if (score >= 65) return { label: "Good", color: "#60a5fa" };
  if (score >= 45) return { label: "Average", color: "#fbbf24" };
  return { label: "Needs Work", color: "#f87171" };
}

export default function ATSScore({ score, breakdown }) {
  const [displayed, setDisplayed] = useState(0);
  const { label, color } = getScoreLabel(score);

  // Animate count up
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const step = score / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= score) { setDisplayed(score); clearInterval(timer); }
      else setDisplayed(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  // SVG arc
  const r = 80;
  const cx = 110;
  const cy = 110;
  const circumference = Math.PI * r; // half-circle
  const filled = (score / 100) * circumference;

  return (
    <div className="ats-card">
      <div className="ats-card__header">
        <h3 className="ats-card__title">ATS Score</h3>
        <span className="ats-card__badge" style={{ color, background: `${color}18`, border: `1px solid ${color}40` }}>
          {label}
        </span>
      </div>

      <div className="ats-gauge">
        <svg viewBox="0 0 220 130" className="ats-gauge__svg">
          {/* Track */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none" stroke="var(--border)" strokeWidth="14" strokeLinecap="round"
          />
          {/* Fill */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference}`}
            style={{ filter: `drop-shadow(0 0 8px ${color}80)`, transition: "stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)" }}
          />
          {/* Score text */}
          <text x={cx} y={cy - 8} textAnchor="middle" fill={color} fontSize="36" fontFamily="Syne" fontWeight="800">
            {displayed}
          </text>
          <text x={cx} y={cy + 16} textAnchor="middle" fill="var(--text-secondary)" fontSize="13" fontFamily="Syne">
            out of 100
          </text>
        </svg>
      </div>

      {breakdown && (
        <div className="ats-breakdown">
          {[
            { key: "core", label: "Core Skills", weight: "60%", color: "#6ee7b7" },
            { key: "advanced", label: "Advanced", weight: "30%", color: "#60a5fa" },
            { key: "soft", label: "Soft Skills", weight: "10%", color: "#a78bfa" },
          ].map(({ key, label: lbl, color: c }) => {
            const b = breakdown[key];
            const pct = b ? Math.round((b.matched / b.total) * 100) : 0;
            return (
              <div className="ats-breakdown__item" key={key}>
                <div className="ats-breakdown__meta">
                  <span className="ats-breakdown__label">{lbl}</span>
                  <span className="ats-breakdown__count" style={{ color: c }}>
                    {b?.matched}/{b?.total}
                  </span>
                </div>
                <div className="ats-breakdown__bar-track">
                  <div
                    className="ats-breakdown__bar-fill"
                    style={{ "--target-width": `${pct}%`, background: c }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
