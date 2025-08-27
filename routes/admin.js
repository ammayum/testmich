const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const Member = require("../models/Member");
const { sendEmail, sendWhatsApp } = require("../utils/notifications"); // your existing email/whatsapp functions





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

    // Set session
    req.session.admin = admin._id;

    // Save session before redirecting
    req.session.save(err => {
      if (err) {
        console.error('Session save error:', err);
        return res.render('admin/login', { error: 'Session error. Try again.' });
      }
      res.redirect('/admin/members'); // only send response here
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.render('admin/login', { error: 'Something went wrong. Try again.' });
  }
});

// ========================
// Logout route
// ========================
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
    res.redirect('/admin/login');
  });
});

// ========================
// Middleware to protect CMS routes
// ========================
const isAdmin = (req, res, next) => {
  if (req.session && req.session.admin) return next();
  res.redirect('/admin/login');
};



// ========================

// View all members
router.get("/members", isAdmin, async (req, res) => {
  const members = await Member.find().sort({ createdAt: -1 });
  res.render("admin/members", { members });
});

// Change member status
router.post("/members/:id/status", isAdmin, async (req, res) => {
  const { status } = req.body;
  const member = await Member.findByIdAndUpdate(req.params.id, { status }, { new: true });

  // Notifications
  if (status === "approved") {
    sendEmail(member.email, "Membership Approved", `Hello ${member.name}, your membership is approved!`);
    
  } else if (status === "declined") {
    sendEmail(member.email, "Membership Declined", `Hello ${member.name}, your membership was declined.`);
    
  }

  res.redirect("/admin/members");
});


// ========================
// Export both separately
// ========================
module.exports = {
  router,
  isAdmin
};
