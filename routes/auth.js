const config = require('config');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const User = require('../models/users');
const _ = require('lodash');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const requiredProperties = ['username', 'password'];

router.post('/', async (req, res) => (
  new User(_.pick(req.body, requiredProperties)).authenticateUser()
    .then((user) => {
      const token = jwt.sign({username: user.username}, config.get('jwtPrivateKey'));
      return res.header('x-auth-token', token).status(200).json({
        success: true,
        payload: token,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        success: false,
        payload: err,
      });
    })
));

module.exports = router;