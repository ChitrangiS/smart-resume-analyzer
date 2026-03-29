import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const loc = useLocation();
  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M9 12h6M9 16h6M13 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 4v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span>ResumeIQ</span>
        </Link>
        <div className="navbar__links">
          <Link to="/" className={`navbar__link ${loc.pathname === "/" ? "active" : ""}`}>Analyze</Link>
          <Link to="/history" className={`navbar__link ${loc.pathname === "/history" ? "active" : ""}`}>History</Link>
        </div>
      </div>
    </nav>
  );
}
