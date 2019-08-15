
const express = require('express');
const router = express.Router();
const User = require('../models/users');
const _ = require('lodash');

router.use(express.json()); //populate req.body
router.use(express.urlencoded({ extended: true })); //key=value&...

requiredProperties = ['username', 'password'];

router.post('/', async (req, res) => (
  new User(_.pick(req.body, requiredProperties)).authenticateUser()
    .then((user) => {
      const result = _.pick(user, ['username']);
      return res.status(200).json({
        success: true,
        payload: {value: 'authenticate' , result},
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