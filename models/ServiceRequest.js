const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  service: { type: String, required: true },
  message: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
