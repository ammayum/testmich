const express = require('express');
const router = express.Router();
const SiteContent = require('../models/SiteContent');

// ========================
// Middleware: protect CMS
// ========================
function requireAdmin(req, res, next) {
  if (!req.session || !req.session.admin) {
    return res.redirect('/admin/login');
  }
  next();
}

// ========================
// Dashboard: list all sections
// ========================
router.get('/', requireAdmin, async (req, res) => {
  try {
    const contents = await SiteContent.find({});
    res.render('admin/cms/dashboard', { contents });
  } catch (err) {
    console.error('CMS dashboard error:', err);
    res.status(500).send('Server Error');
  }
});

// ========================
// Edit a specific section
// ========================
router.get('/edit/:section', requireAdmin, async (req, res) => {
  try {
    let section = await SiteContent.findOne({ section: req.params.section });

    if (!section) {
      // Create a blank section if it does not exist
      section = new SiteContent({
        section: req.params.section,
        content: {}
      });
      await section.save();
    }

    // Ensure content is always an object
    const sectionContent = typeof section.content === 'object' ? section.content : {};

    res.render('admin/cms/edit', {
      section: {
        section: section.section,
        content: sectionContent
      }
    });
  } catch (err) {
    console.error('CMS edit error:', err);
    res.status(500).send('Server Error');
  }
});

// ========================
// Save section updates
// ========================
router.post('/edit/:section', requireAdmin, async (req, res) => {
  try {
    console.log('Saving content:', req.body);

    await SiteContent.findOneAndUpdate(
      { section: req.params.section },
      { content: req.body, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.redirect('/admin/cms'); // redirect back to dashboard
  } catch (err) {
    console.error('CMS save error:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
