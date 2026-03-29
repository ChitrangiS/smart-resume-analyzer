import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchAnalysis } from "../utils/api";
import ATSScore from "../components/ATSScore";
import SkillsPanel from "../components/SkillsPanel";
import Suggestions from "../components/Suggestions";
import ResumeStats from "../components/ResumeStats";
import "./ResultPage.css";

export default function ResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchAnalysis(id)
      .then(r => { setData(r.data.data); setLoading(false); })
      .catch(err => {
        setError(err.response?.data?.message || "Failed to load analysis.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="result-loading">
      <div className="result-loading__spinner" />
      <p>Loading your analysis…</p>
    </div>
  );

  if (error) return (
    <div className="result-error">
      <p>{error}</p>
      <Link to="/" className="result-error__link">← Analyze another resume</Link>
    </div>
  );

  if (!data) return null;

  const matchPct = data.foundSkills?.length && data.totalRoleSkills
    ? Math.round((data.foundSkills.length / data.totalRoleSkills) * 100)
    : 0;

  return (
    <div className="result-page">
      <div className="container">
        {/* Header */}
        <div className="result-header">
          <div className="result-header__left">
            <Link to="/" className="result-back">← New Analysis</Link>
            <h1 className="result-title">Analysis Results</h1>
            <div className="result-meta">
              <span className="result-meta__role">{data.role}</span>
              <span className="result-meta__dot" />
              <span className="result-meta__date">
                {new Date(data.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>
          <div className="result-header__right">
            <div className="result-summary-pills">
              <div className="summary-pill">
                <span className="summary-pill__val" style={{ color: "var(--accent)" }}>{data.atsScore}%</span>
                <span className="summary-pill__label">ATS Score</span>
              </div>
              <div className="summary-pill">
                <span className="summary-pill__val" style={{ color: "var(--blue)" }}>{data.foundSkills?.length}</span>
                <span className="summary-pill__label">Skills Found</span>
              </div>
              <div className="summary-pill">
                <span className="summary-pill__val" style={{ color: "var(--red)" }}>{data.missingSkills?.length}</span>
                <span className="summary-pill__label">Skills Missing</span>
              </div>
              <div className="summary-pill">
                <span className="summary-pill__val" style={{ color: "var(--yellow)" }}>{data.suggestions?.length}</span>
                <span className="summary-pill__label">Suggestions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="result-grid">
          {/* Sidebar */}
          <aside className="result-sidebar">
            <ATSScore score={data.atsScore} breakdown={data.scoreBreakdown} />
            <div className="coverage-card">
              <div className="coverage-card__label">Skill Coverage</div>
              <div className="coverage-card__bar-track">
                <div
                  className="coverage-card__bar-fill"
                  style={{ "--target-width": `${matchPct}%` }}
                />
              </div>
              <div className="coverage-card__meta">
                <span>{data.foundSkills?.length} of {data.totalRoleSkills} skills matched</span>
                <span style={{ color: "var(--accent)" }}>{matchPct}%</span>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="result-main">
            <SkillsPanel foundSkills={data.foundSkills || []} missingSkills={data.missingSkills || []} />
            <Suggestions suggestions={data.suggestions || []} />
            <ResumeStats
              wordCount={data.wordCount}
              characterCount={data.characterCount}
              sections={data.sections}
              wordFrequency={data.wordFrequency}
              originalName={data.originalName}
              fileType={data.fileType}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
