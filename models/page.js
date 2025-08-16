const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: String,
  subtitle: String,
  content: String,
  image: String,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Page', pageSchema);
