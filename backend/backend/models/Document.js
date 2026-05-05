const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, default: "Active", enum: ["Active", "Completed", "Pending"] },
  filename: { type: String },
  originalname: { type: String },
  mimetype: { type: String },
  size: { type: Number },
  patientName: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Document", DocumentSchema);
