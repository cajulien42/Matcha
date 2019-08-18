
const express = require('express');
const _ = require('lodash');
const User = require('../models/users');


const router = express.Router();
const requiredProperties = ['username', 'password'];

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.post('/', async (req, res) => (
  new User(_.pick(req.body, requiredProperties)).authenticateUser()
    .then(token => (
      res.header('x-auth-token', token).status(200).json({
        success: true,
        payload: token,
      }))
      .catch(err => (
        res.status(400).json({
          success: false,
          payload: err,
        })
      )))
));

module.exports = router;
