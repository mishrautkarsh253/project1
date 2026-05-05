import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">🏥</span>
        <span className="brand-name">ClinicalDoc</span>
      </div>
      <ul className="navbar-links">
        <li><Link to="/" className={location.pathname === "/" ? "active" : ""}>Dashboard</Link></li>
        <li><Link to="/patients" className={location.pathname === "/patients" ? "active" : ""}>Patients</Link></li>
        <li><Link to="/documents" className={location.pathname === "/documents" ? "active" : ""}>Documents</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
