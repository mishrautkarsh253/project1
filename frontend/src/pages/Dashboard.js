import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPatients } from "../services/api";
import "./Pages.css";

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatients()
      .then((res) => setPatients(res.data))
      .catch(() => setPatients([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Welcome to your Clinical Documentation System</p>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-value">{loading ? "..." : patients.length}</span>
            <span className="stat-label">Total Patients</span>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">📄</div>
          <div className="stat-info">
            <span className="stat-value">0</span>
            <span className="stat-label">Documents</span>
          </div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <span className="stat-value">{new Date().toLocaleDateString("en-IN")}</span>
            <span className="stat-label">Today's Date</span>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/patients" className="action-card">
            <span className="action-icon">➕</span>
            <span>Add New Patient</span>
          </Link>
          <Link to="/documents" className="action-card">
            <span className="action-icon">📝</span>
            <span>View Documents</span>
          </Link>
        </div>
      </div>

      {!loading && patients.length > 0 && (
        <div className="recent-section">
          <h2>Recent Patients</h2>
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Age</th><th>Gender</th><th>Contact</th></tr>
            </thead>
            <tbody>
              {patients.slice(-5).reverse().map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.age}</td>
                  <td>{p.gender}</td>
                  <td>{p.contact || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
