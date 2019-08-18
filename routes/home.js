const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Matcha', message: 'Welcome to Matcha' });
});

module.exports = router;
