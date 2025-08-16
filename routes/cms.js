// routes/cms.js
const express = require('express');
const router = express.Router();
const SiteContent = require('../models/SiteContent');

// Middleware: Only logged-in admin can access CMS
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/admin/login');
  }
  next();
}

// Dashboard: show list of editable sections
router.get('/', requireLogin, async (req, res) => {
  const contents = await SiteContent.find({});
  res.render('cms/dashboard', { contents });
});

// Edit specific section
router.get('/edit/:section', requireLogin, async (req, res) => {
  const section = await SiteContent.findOne({ section: req.params.section });
  res.render('cms/edit', { section });
});

// Save updates
router.post('/edit/:section', requireLogin, async (req, res) => {
  await SiteContent.findOneAndUpdate(
    { section: req.params.section },
    { content: req.body, updatedAt: new Date() },
    { upsert: true }
  );
  res.redirect('/cms');
});

module.exports = router;
