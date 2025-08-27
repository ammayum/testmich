const express = require('express');
const router = express.Router();
const SiteContent = require('../models/SiteContent');

// ========================
// Middleware: protect CMS
// ========================
function requireLogin(req, res, next) {
  if (!req.session.admin) {
    return res.redirect('/admin/login');
  }
  next();
}

// ========================
// Dashboard: list all sections
// ========================
router.get('/', requireLogin, async (req, res) => {
  const contents = await SiteContent.find({});
  res.render('admin/cms/dashboard', { contents });
});

// ========================
// Edit a specific section
// ========================
router.get('/edit/:section', requireLogin, async (req, res) => {
  const section = await SiteContent.findOne({ section: req.params.section });
  res.render('cms/edit', { section });
});

// ========================
// Save section updates
// ========================
router.post('/edit/:section', requireLogin, async (req, res) => {
  await SiteContent.findOneAndUpdate(
    { section: req.params.section },
    { content: req.body, updatedAt: new Date() },
    { upsert: true }
  );
  res.redirect('/cms');
});

module.exports = router;
