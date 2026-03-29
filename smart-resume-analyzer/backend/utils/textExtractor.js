const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

async function extractTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".pdf") {
    return extractFromPDF(filePath);
  } else if (ext === ".docx" || ext === ".doc") {
    return extractFromDOCX(filePath);
  } else if (ext === ".txt") {
    return fs.readFileSync(filePath, "utf8");
  } else {
    throw new Error(`Unsupported file type: ${ext}`);
  }
}

async function extractFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

async function extractFromDOCX(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

module.exports = { extractTextFromFile };
