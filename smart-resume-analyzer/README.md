# 🧠 ResumeIQ – Smart Resume Analyzer

A full-stack AI-powered resume analyzer that gives you an **ATS compatibility score**, extracts skills, identifies gaps, and provides prioritized suggestions to improve your resume.

---

## 📁 Project Structure

```
smart-resume-analyzer/
├── backend/
│   ├── controllers/
│   │   └── resumeController.js     # Business logic handlers
│   ├── data/
│   │   └── skillsDataset.js        # Skills database for 6 job roles
│   ├── middleware/
│   │   └── upload.js               # Multer file upload config
│   ├── models/
│   │   └── Resume.js               # Mongoose schema
│   ├── routes/
│   │   └── api.js                  # Express REST routes
│   ├── utils/
│   │   ├── analyzer.js             # NLP: keyword extraction, ATS scoring, suggestions
│   │   └── textExtractor.js        # PDF/DOCX/TXT text extraction
│   ├── uploads/                    # Temp upload dir (auto-created)
│   ├── .env                        # Environment config
│   ├── package.json
│   └── server.js                   # Express app entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ATSScore.jsx/css    # Animated gauge with breakdown
│   │   │   ├── Navbar.jsx/css      # Sticky navigation
│   │   │   ├── ResumeStats.jsx/css # Word freq, sections, file info
│   │   │   ├── SkillsPanel.jsx/css # Found/missing skill tabs
│   │   │   └── Suggestions.jsx/css # Filterable improvement tips
│   │   ├── pages/
│   │   │   ├── UploadPage.jsx/css  # Drag-drop upload + role select
│   │   │   ├── ResultPage.jsx/css  # Full analysis dashboard
│   │   │   └── HistoryPage.jsx/css # Past analysis history
│   │   ├── utils/
│   │   │   └── api.js              # Axios API client
│   │   ├── App.js
│   │   ├── index.css               # Global design system
│   │   └── index.js
│   └── package.json
│
├── package.json                    # Root orchestration scripts
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16 or higher
- **MongoDB** running locally (or provide a MongoDB Atlas URI)

### 1. Clone and Install

```bash
# Install all dependencies (backend + frontend)
npm run install:all
```

### 2. Configure Environment

The backend `.env` file is pre-configured with defaults:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart_resume_analyzer
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Edit `backend/.env` if you need a different MongoDB URI (e.g., Atlas).

> **Note:** The app works even without MongoDB — analysis runs fine, but history won't be saved.

### 3. Start the App

```bash
# Start both backend (port 5000) and frontend (port 3000)
npm start
```

Or start separately:

```bash
# Terminal 1 – Backend
npm run start:backend

# Terminal 2 – Frontend  
npm run start:frontend
```

Open **http://localhost:3000** in your browser.

---

## ✨ Features

### 📤 Upload Page
- Drag-and-drop or click-to-browse file upload
- Supports **PDF**, **DOCX**, **DOC**, **TXT**
- Max file size: **5MB**
- Select from **6 job roles**

### 📊 Result Dashboard
- **ATS Score** — weighted gauge (core 60%, advanced 30%, soft 10%)
- **Score Breakdown** — per-category progress bars
- **Skill Coverage** — found vs total skills for role
- **Found Skills** — all matched keywords highlighted
- **Missing Skills** — gaps compared to role requirements
- **Suggestions** — prioritized (High/Medium/Low) with categories
- **Keyword Frequency** — top words used in resume
- **Section Detection** — which resume sections were found
- **Document Stats** — word count, character count, file type

### 🕐 History
- View all past analyses
- ATS score at a glance
- Delete individual analyses
- Click to revisit any full result

---

## 🎯 Supported Job Roles

| Role | Core Skills | Advanced | Soft |
|------|------------|---------|------|
| Frontend Developer | 24 | 14 | 8 |
| Backend Developer | 25 | 15 | 8 |
| Data Scientist | 22 | 18 | 8 |
| DevOps Engineer | 20 | 15 | 8 |
| Full Stack Developer | 22 | 13 | 8 |
| Mobile Developer | 19 | 13 | 7 |

---

## 🔌 REST API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/roles` | List all available job roles |
| POST | `/api/resume/upload` | Upload + analyze a resume |
| GET | `/api/resume/history` | Get recent analyses (last 20) |
| GET | `/api/resume/:id` | Get a specific analysis |
| DELETE | `/api/resume/:id` | Delete an analysis |

### Upload Request (multipart/form-data)
```
POST /api/resume/upload
Content-Type: multipart/form-data

resume: <file>
role: "frontend" | "backend" | "datascience" | "devops" | "fullstack" | "mobile"
```

### Upload Response
```json
{
  "success": true,
  "data": {
    "id": "...",
    "role": "Frontend Developer",
    "atsScore": 72,
    "scoreBreakdown": {
      "core": { "matched": 16, "total": 24, "weight": "60%" },
      "advanced": { "matched": 8, "total": 14, "weight": "30%" },
      "soft": { "matched": 5, "total": 8, "weight": "10%" }
    },
    "foundSkills": ["react", "typescript", "css", "..."],
    "missingSkills": ["graphql", "storybook", "..."],
    "suggestions": [
      { "priority": "high", "category": "Core Skills Gap", "message": "..." }
    ],
    "sections": { "summary": true, "experience": true, "skills": false, "..." },
    "wordFrequency": [{ "word": "react", "count": 8 }],
    "wordCount": 542
  }
}
```

---

## 🧪 How the ATS Scoring Works

1. **Text Extraction** — PDF/DOCX parsed to plain text
2. **Tokenization** — lowercased, stop words removed, n-grams built (up to 3 words)
3. **Keyword Matching** — each role skill checked against n-gram set
4. **Weighted Scoring**:
   - Core skills: 60% weight
   - Advanced skills: 30% weight  
   - Soft skills: 10% weight
5. **Section Detection** — regex patterns detect resume sections
6. **Suggestion Generation** — rules based on score, missing skills, sections, word count, metrics

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| File Upload | Multer |
| PDF Parsing | pdf-parse |
| DOCX Parsing | mammoth |
| Fonts | Syne + DM Mono (Google Fonts) |

---

## 🔧 Development

```bash
# Run backend with auto-reload (nodemon)
npm run dev:backend

# Run frontend dev server
npm run start:frontend
```

---

## 📝 License

MIT — free to use and modify.
