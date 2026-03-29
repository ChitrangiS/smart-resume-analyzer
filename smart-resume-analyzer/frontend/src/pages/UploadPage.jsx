import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume, fetchRoles } from "../utils/api";
import "./UploadPage.css";

const MAX_SIZE_MB = 5;

export default function UploadPage() {
  const navigate = useNavigate();
  const fileRef = useRef();

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [stage, setStage] = useState("idle"); // idle | uploading | analyzing | done

  useEffect(() => {
    fetchRoles()
      .then(r => {
        setRoles(r.data.data);
        if (r.data.data.length) setSelectedRole(r.data.data[0].key);
      })
      .catch(() => setError("Could not load roles. Is the backend running?"));
  }, []);

  const handleFile = (f) => {
    if (!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    if (!["pdf", "doc", "docx", "txt"].includes(ext)) {
      return setError("Please upload a PDF, DOC, DOCX, or TXT file.");
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      return setError(`File size must be under ${MAX_SIZE_MB}MB.`);
    }
    setError("");
    setFile(f);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const handleSubmit = async () => {
    if (!file || !selectedRole) return;
    setUploading(true);
    setStage("uploading");
    setError("");

    try {
      const res = await uploadResume(file, selectedRole, (p) => {
        setProgress(p);
        if (p === 100) setStage("analyzing");
      });
      setStage("done");
      navigate(`/result/${res.data.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
      setStage("idle");
      setUploading(false);
    }
  };

  const selectedRoleData = roles.find(r => r.key === selectedRole);

  return (
    <div className="upload-page">
      <div className="container">
        <header className="upload-hero">
          <div className="upload-hero__eyebrow">AI-Powered Resume Analysis</div>
          <h1 className="upload-hero__title">
            Get your resume<br />
            <span className="upload-hero__accent">ATS-ready</span>
          </h1>
          <p className="upload-hero__sub">
            Upload your resume and select a job role. We'll analyze keyword density,
            skill gaps, and give you actionable improvements.
          </p>
        </header>

        <div className="upload-card">
          {/* Drop Zone */}
          <div
            className={`dropzone ${dragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => !file && fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="sr-only"
              onChange={e => handleFile(e.target.files[0])}
            />
            {file ? (
              <div className="dropzone__file">
                <div className="dropzone__file-icon">
                  {file.name.endsWith(".pdf") ? "📄" : "📝"}
                </div>
                <div className="dropzone__file-info">
                  <span className="dropzone__filename">{file.name}</span>
                  <span className="dropzone__filesize">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
                <button
                  className="dropzone__remove"
                  onClick={e => { e.stopPropagation(); setFile(null); setError(""); }}
                >✕</button>
              </div>
            ) : (
              <div className="dropzone__prompt">
                <div className="dropzone__icon">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="dropzone__text">
                  <strong>Drop your resume here</strong><br />
                  <span>or click to browse</span>
                </p>
                <p className="dropzone__hint">PDF, DOC, DOCX, TXT · Max {MAX_SIZE_MB}MB</p>
              </div>
            )}
          </div>

          {/* Role Selection */}
          <div className="role-section">
            <label className="role-section__label">Target Job Role</label>
            <div className="role-grid">
              {roles.map(r => (
                <button
                  key={r.key}
                  className={`role-chip ${selectedRole === r.key ? "selected" : ""}`}
                  onClick={() => setSelectedRole(r.key)}
                >
                  <span className="role-chip__title">{r.title}</span>
                  <span className="role-chip__count">{r.coreSkillCount + r.advancedSkillCount} skills</span>
                </button>
              ))}
            </div>
            {selectedRoleData && (
              <div className="role-detail">
                <span>Core: <strong>{selectedRoleData.coreSkillCount}</strong></span>
                <span>Advanced: <strong>{selectedRoleData.advancedSkillCount}</strong></span>
                <span>Soft: <strong>{selectedRoleData.softSkillCount}</strong></span>
              </div>
            )}
          </div>

          {/* Error */}
          {error && <div className="upload-error">{error}</div>}

          {/* Upload Button */}
          <button
            className={`upload-btn ${uploading ? "loading" : ""}`}
            onClick={handleSubmit}
            disabled={!file || !selectedRole || uploading}
          >
            {uploading ? (
              <>
                <span className="upload-btn__spinner" />
                {stage === "analyzing" ? "Analyzing Resume…" : `Uploading… ${progress}%`}
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Analyze Resume
              </>
            )}
          </button>

          {uploading && (
            <div className="upload-progress-track">
              <div className="upload-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>

        {/* Feature hints */}
        <div className="upload-features">
          {[
            { icon: "⚡", title: "ATS Score", desc: "Weighted keyword match score" },
            { icon: "🎯", title: "Skill Gap Analysis", desc: "See what's missing for your role" },
            { icon: "📋", title: "Smart Suggestions", desc: "Prioritized improvement tips" },
          ].map(f => (
            <div key={f.title} className="feature-chip">
              <span className="feature-chip__icon">{f.icon}</span>
              <div>
                <div className="feature-chip__title">{f.title}</div>
                <div className="feature-chip__desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
