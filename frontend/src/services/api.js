import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
const BACKEND_BASE = BASE_URL.replace(/\/api\/?$/, "");
const API = axios.create({ baseURL: BASE_URL });

// Patients
export const getPatients = () => API.get("/patients");
export const createPatient = (data) => API.post("/patients", data);

// Documents
export const getDocuments = () => API.get("/documents");
export const uploadDocument = (formData) =>
  API.post("/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteDocument = (id) => API.delete(`/documents/${id}`);
export const getDownloadUrl = (id) => `${BACKEND_BASE}/api/documents/download/${id}`;
