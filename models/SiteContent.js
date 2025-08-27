const mongoose = require('mongoose');

const SiteContentSchema = new mongoose.Schema({
  section: { type: String, required: true, unique: true },
  content: { type: Object, default: {} }, // stores flexible content fields
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SiteContent', SiteContentSchema);
