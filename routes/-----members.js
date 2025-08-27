const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  joinedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" }
});

module.exports = mongoose.model("Member", memberSchema);
