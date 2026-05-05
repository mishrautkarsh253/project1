import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import PatientPage from "./pages/PatientPage";
import DocumentPage from "./pages/DocumentPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<PatientPage />} />
            <Route path="/documents" element={<DocumentPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
