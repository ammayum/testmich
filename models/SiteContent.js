// models/SiteContent.js
const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
  section: { type: String, required: true }, // e.g. 'header', 'footer', 'hero', 'services'
  content: { type: mongoose.Schema.Types.Mixed }, // flexible JSON for text, links, images
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SiteContent', siteContentSchema);
