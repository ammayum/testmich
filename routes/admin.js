const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');

// Admin login page
router.get('/login', (req, res) => {
  res.render('admin/login'); // render login.ejs
});

// Admin login POST
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.render('admin/login', { error: 'Please enter username and password' });
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.render('admin/login', { error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, admin.password);

    if (!validPassword) {
      return res.render('admin/login', { error: 'Invalid credentials' });
    }

    // Set session
    req.session.admin = admin._id;

    // Redirect to CMS dashboard
    res.redirect('/cms');

  } catch (err) {
    console.error('Login error:', err);
    res.render('admin/login', { error: 'Something went wrong. Try again.' });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
    res.redirect('/admin/login');
  });
});

// Middleware to protect CMS routes
const isAdmin = (req, res, next) => {
  if (req.session.admin) return next();
  res.redirect('/admin/login');
};

module.exports = router;
module.exports.isAdmin = isAdmin;
