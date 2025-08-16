const express = require('express');
const router = express.Router();

router.get('/:lang', (req, res) => {
  res.cookie('lang', req.params.lang, { maxAge: 900000, httpOnly: true });
  res.redirect('back');
});

module.exports = router;
