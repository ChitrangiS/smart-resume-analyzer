import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

export const uploadResume = (file, role, onProgress) => {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("role", role);

  return API.post("/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });
};

export const fetchRoles = () => API.get("/roles");
export const fetchHistory = () => API.get("/resume/history");
export const fetchAnalysis = (id) => API.get(`/resume/${id}`);
export const deleteAnalysis = (id) => API.delete(`/resume/${id}`);

export default API;
