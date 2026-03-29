import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchHistory, deleteAnalysis } from "../utils/api";
import "./HistoryPage.css";

function scoreColor(score) {
  if (score >= 80) return "var(--accent)";
  if (score >= 65) return "var(--blue)";
  if (score >= 45) return "var(--yellow)";
  return "var(--red)";
}

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    fetchHistory()
      .then(r => { setItems(r.data.data); setLoading(false); })
      .catch(err => {
        setError(err.response?.data?.message || "Could not load history. Is the backend running?");
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Delete this analysis?")) return;
    setDeleting(id);
    try {
      await deleteAnalysis(id);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch {
      alert("Delete failed.");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return (
    <div className="history-loading">
      <div className="history-spinner" />
      <p>Loading history…</p>
    </div>
  );

  return (
    <div className="history-page">
      <div className="container">
        <div className="history-header">
          <div>
            <h1 className="history-title">Analysis History</h1>
            <p className="history-sub">{items.length} resume{items.length !== 1 ? "s" : ""} analyzed</p>
          </div>
          <Link to="/" className="history-new-btn">+ New Analysis</Link>
        </div>

        {error && <div className="history-error">{error}</div>}

        {items.length === 0 && !error ? (
          <div className="history-empty">
            <div className="history-empty__icon">📂</div>
            <p>No analyses yet.</p>
            <Link to="/" className="history-empty__link">Upload your first resume →</Link>
          </div>
        ) : (
          <div className="history-grid">
            {items.map((item, i) => (
              <Link
                key={item._id}
                to={`/result/${item._id}`}
                className="history-card"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="history-card__top">
                  <div className="history-card__file">
                    <span className="history-card__icon">{item.fileType === "pdf" ? "📄" : "📝"}</span>
                    <div>
                      <div className="history-card__name">{item.originalName}</div>
                      <div className="history-card__date">
                        {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </div>
                  </div>
                  <button
                    className={`history-card__delete ${deleting === item._id ? "deleting" : ""}`}
                    onClick={e => handleDelete(item._id, e)}
                    title="Delete"
                  >
                    {deleting === item._id ? "…" : "✕"}
                  </button>
                </div>

                <div className="history-card__score-row">
                  <div className="history-card__score" style={{ color: scoreColor(item.atsScore) }}>
                    {item.atsScore}
                    <span className="history-card__pct">%</span>
                  </div>
                  <div className="history-card__score-bar-wrap">
                    <div className="history-card__score-label">ATS Score</div>
                    <div className="history-card__score-bar">
                      <div
                        className="history-card__score-fill"
                        style={{
                          "--target-width": `${item.atsScore}%`,
                          background: scoreColor(item.atsScore),
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="history-card__meta">
                  <span className="history-card__role">{item.role}</span>
                  <div className="history-card__pills">
                    <span className="hpill found">{item.foundSkills?.length} found</span>
                    <span className="hpill missing">{item.missingSkills?.length} missing</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
