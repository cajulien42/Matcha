
const express = require('express');
const router = express.Router();
const User = require('../models/users');

router.use(express.json()); //populate req.body
router.use(express.urlencoded({ extended: true })); //key=value&...

module.exports = router;