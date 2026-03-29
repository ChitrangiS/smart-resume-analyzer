# ResumeIQ- Smart Resume Analyzer

## 📌 Overview

**Smart Resume Analyzer** is a web-based application that analyzes resumes and extracts meaningful insights such as skills, keywords, and relevant information. It helps automate the resume screening process, making it faster and more efficient for recruiters and useful for candidates to evaluate their resumes.

---

## 🚀 Features

* 📄 Upload resumes (PDF/DOCX format)
* 🔍 Extract text from resumes
* 🧠 Identify key skills and keywords
* 📊 Basic resume analysis and insights
* 🌐 User-friendly frontend interface
* 🔗 REST API backend for processing

---

## 🏗️ Tech Stack

### 🔹 Frontend

* React.js
* HTML, CSS, JavaScript

### 🔹 Backend

* Node.js
* Express.js

### 🔹 Database

* MongoDB

### 🔹 Libraries & Tools

* `multer` → File upload handling
* `pdf-parse` → PDF text extraction
* `mammoth` → DOCX parsing
* `mongoose` → MongoDB interaction
* `cors`, `dotenv` → Backend utilities

---

## 📁 Project Structure

```bash
smart-resume-analyzer/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── uploads/
├── README.md
```

---



### 1️⃣ Clone the repository

```bash
git clone https://github.com/ChitrangiS/smart-resume-analyzer
cd smart-resume-analyzer
```

## ▶️ How to Use

1. Start the backend server
2. Start the frontend application
3. Open browser 
4. Upload a resume file (PDF/DOCX)
5. View extracted insights and analysis

---

## 📡 API Endpoints

### 📄 Upload Resume

```
POST /upload
```

### 📊 Analyze Resume

```
POST /analyze
```

---

## 🧪 Example Workflow

* Upload resume file
* System extracts text
* Processes and identifies skills
* Returns structured insights

---


## 📊 Applications

* Resume screening automation
* Recruitment assistance
* Skill extraction systems

---

## 🔮 Future Improvements

* AI-based resume scoring
* Job-role matching system
* Advanced NLP integration
* Better UI/UX
* Cloud deployment

---

## 👩‍💻 Author

**Chitrangi Samal**

---


