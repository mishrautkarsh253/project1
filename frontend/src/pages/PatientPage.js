import React, { useEffect, useState } from "react";
import { getPatients, createPatient } from "../services/api";
import "./Pages.css";

const PatientPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ name: "", age: "", gender: "", contact: "", address: "" });

  const fetchPatients = () => {
    getPatients().then((res) => setPatients(res.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createPatient(form);
      setSuccess("Patient added successfully!");
      setForm({ name: "", age: "", gender: "", contact: "", address: "" });
      setShowForm(false);
      fetchPatients();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      alert("Error saving patient: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Patients</h1>
          <p className="page-subtitle">Manage all patient records</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Cancel" : "➕ Add Patient"}
        </button>
      </div>

      {success && <div className="alert-success">{success}</div>}

      {showForm && (
        <div className="form-card">
          <h2>New Patient</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Ramesh Kumar" required />
              </div>
              <div className="form-group">
                <label>Age *</label>
                <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="e.g. 35" required min="0" max="150" />
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select name="gender" value={form.gender} onChange={handleChange} required>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Contact</label>
                <input name="contact" value={form.contact} onChange={handleChange} placeholder="e.g. 9876543210" />
              </div>
              <div className="form-group full-width">
                <label>Address</label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="e.g. 123 MG Road, Delhi" />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : "💾 Save Patient"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading patients...</div>
      ) : patients.length === 0 ? (
        <div className="empty-state">
          <span>👤</span>
          <p>No patients yet. Add your first patient!</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Age</th><th>Gender</th><th>Contact</th><th>Address</th><th>Added On</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p, i) => (
                <tr key={p._id}>
                  <td>{i + 1}</td>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.age}</td>
                  <td><span className={`badge badge-${p.gender?.toLowerCase()}`}>{p.gender}</span></td>
                  <td>{p.contact || "—"}</td>
                  <td>{p.address || "—"}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientPage;
