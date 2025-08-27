const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const Member = require("../models/Member");
const { sendEmail, sendWhatsApp } = require("../utils/notifications");

// ========================
// Middleware: Protect admin routes
// ========================
const requireAdminLogin = (req, res, next) => {
  if (req.session && req.session.admin) return next();
  res.redirect('/admin/login');
};

// ========================
// Admin login page
// ========================
router.get('/login', (req, res) => {
  res.render('admin/login', { error: null });
});

// ========================
// Admin login POST
// ========================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.render('admin/login', { error: 'Please enter username and password' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) return res.render('admin/login', { error: 'Invalid username' });

    const validPassword = await bcrypt.compare(password.trim(), admin.password);
    if (!validPassword) return res.render('admin/login', { error: 'Invalid password' });

    req.session.admin = admin._id;

    req.session.save(err => {
      if (err) {
        console.error('Session save error:', err);
        return res.render('admin/login', { error: 'Session error. Try again.' });
      }
      res.redirect('/admin/cms'); // Redirect to CMS dashboard after login
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.render('admin/login', { error: 'Something went wrong. Try again.' });
  }
});

// ========================
// Logout
// ========================
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
    res.redirect('/admin/login');
  });
});

// ========================
// Members page (admin only)
// ========================
router.get('/members', requireAdminLogin, async (req, res) => {
  const members = await Member.find().sort({ createdAt: -1 });
  res.render('admin/members', { members });
});

// Change member status (admin only)
router.post('/members/:id/status', requireAdminLogin, async (req, res) => {
  const { status } = req.body;
  const member = await Member.findByIdAndUpdate(req.params.id, { status }, { new: true });

  // Send notifications
  if (status === 'approved') {
    sendEmail(member.email, 'Membership Approved', `Hello ${member.name}, your membership is approved!`);
    // sendWhatsApp(member.phone, `Your membership is approved!`);
  } else if (status === 'declined') {
    sendEmail(member.email, 'Membership Declined', `Hello ${member.name}, your membership was declined.`);
    // sendWhatsApp(member.phone, `Your membership was declined.`);
  }

  res.redirect('/admin/members');
});

// ========================
// Export router
// ========================
module.exports = router;
module.exports.requireAdminLogin = requireAdminLogin;
