require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const patientRoutes = require("./routes/patientRoutes");
const documentRoutes = require("./backend/routes/documentRoutes");

app.use("/api", patientRoutes);
app.use("/api", documentRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Clinical API Running");
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
