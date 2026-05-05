import React, { useEffect, useState, useRef } from "react";
import { getDocuments, uploadDocument, deleteDocument, getDownloadUrl } from "../services/api";
import "./Pages.css";

const DocumentPage = () => {
  const [docs, setDocs] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ title: "", type: "General", status: "Active", patientName: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const DOC_TYPES = ["General", "Form", "Report", "Lab", "Prescription", "Discharge Summary", "Consent", "Other"];

  const fetchDocs = () => {
    getDocuments()
      .then((res) => setDocs(res.data))
      .catch(() => setDocs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDocs(); }, []);

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(""), 3500);
  };

  const handleFile = (file) => {
    if (!file) return;
    const allowed = ["application/pdf", "image/jpeg", "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain"];
    if (!allowed.includes(file.type)) {
      showToast("❌ Only PDF, Word, image, or text files allowed.", true);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast("❌ File must be under 10MB.", true);
      return;
    }
    setSelectedFile(file);
    if (!form.title) setForm((f) => ({ ...f, title: file.name.replace(/\.[^.]+$/, "") }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) { showToast("❌ Please select a file to upload.", true); return; }
    if (!form.title.trim()) { showToast("❌ Please enter a document title.", true); return; }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", form.title);
    formData.append("type", form.type);
    formData.append("status", form.status);
    formData.append("patientName", form.patientName);

    setUploading(true);
    try {
      await uploadDocument(formData);
      showToast("✅ Document uploaded successfully!");
      setForm({ title: "", type: "General", status: "Active", patientName: "" });
      setSelectedFile(null);
      setShowForm(false);
      fetchDocs();
    } catch (err) {
      showToast("❌ Upload failed: " + (err.response?.data?.message || err.message), true);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await deleteDocument(id);
      showToast("🗑️ Document deleted.");
      fetchDocs();
    } catch {
      showToast("❌ Could not delete document.", true);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const typeIcon = (type) => {
    const icons = { Lab: "🧪", Report: "📊", Form: "📋", Prescription: "💊",
      "Discharge Summary": "🏥", Consent: "✍️" };
    return icons[type] || "📄";
  };

  const filtered = docs.filter((d) =>
    d.title?.toLowerCase().includes(search.toLowerCase()) ||
    d.type?.toLowerCase().includes(search.toLowerCase()) ||
    d.patientName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Documents</h1>
          <p className="page-subtitle">Upload and manage clinical documents</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Cancel" : "➕ Upload Document"}
        </button>
      </div>

      {toast && (
        <div className={toast.isError ? "alert-error" : "alert-success"}>
          {toast.msg}
        </div>
      )}

      {showForm && (
        <div className="form-card">
          <h2>Upload New Document</h2>
          <form onSubmit={handleSubmit}>
            {/* Drag & Drop Zone */}
            <div
              className={`drop-zone ${dragOver ? "drag-over" : ""} ${selectedFile ? "has-file" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}
            >
              <input
                type="file"
                ref={fileRef}
                style={{ display: "none" }}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                onChange={(e) => handleFile(e.target.files[0])}
              />
              {selectedFile ? (
                <div className="file-selected">
                  <span className="file-icon">📎</span>
                  <div>
                    <strong>{selectedFile.name}</strong>
                    <span className="file-size">{formatSize(selectedFile.size)}</span>
                  </div>
                  <button type="button" className="remove-file"
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}>✕</button>
                </div>
              ) : (
                <div className="drop-prompt">
                  <span className="drop-icon">☁️</span>
                  <p><strong>Drag & drop</strong> or <span className="link-text">browse</span></p>
                  <small>PDF, Word, Image, TXT — max 10MB</small>
                </div>
              )}
            </div>

            <div className="form-grid" style={{ marginTop: "1rem" }}>
              <div className="form-group">
                <label>Document Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Blood Test Report"
                  required
                />
              </div>
              <div className="form-group">
                <label>Document Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {DOC_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option>Active</option>
                  <option>Completed</option>
                  <option>Pending</option>
                </select>
              </div>
              <div className="form-group">
                <label>Patient Name (optional)</label>
                <input
                  value={form.patientName}
                  onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={uploading}>
              {uploading ? "⏳ Uploading..." : "☁️ Upload Document"}
            </button>
          </form>
        </div>
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍  Search by title, type, or patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Loading documents...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span>📂</span>
          <p>{search ? "No documents match your search." : "No documents yet. Upload your first document!"}</p>
        </div>
      ) : (
        <div className="doc-grid">
          {filtered.map((doc) => (
            <div className="doc-card" key={doc._id}>
              <div className="doc-icon">{typeIcon(doc.type)}</div>
              <div className="doc-info">
                <h3>{doc.title}</h3>
                <span className="doc-meta">
                  {doc.type} {doc.patientName ? `· ${doc.patientName}` : ""} · {formatSize(doc.size)} · {new Date(doc.createdAt).toLocaleDateString("en-IN")}
                </span>
                <span className={`badge badge-status-${doc.status?.toLowerCase()}`}>{doc.status}</span>
              </div>
              <div className="doc-actions">
                <a href={getDownloadUrl(doc._id)} target="_blank" rel="noopener noreferrer">
                  <button className="btn-outline">⬇ Download</button>
                </a>
                <button className="btn-outline btn-danger" onClick={() => handleDelete(doc._id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentPage;
