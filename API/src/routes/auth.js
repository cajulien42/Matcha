
const debug = require('debug')('app:route_auth');
const express = require('express');
const _ = require('lodash');
const User = require('../models/userClass');
const handler = require('../middleware/wrapper');

const router = express.Router();
const requiredProperties = ['username', 'password'];

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.post('/', handler(async (req, res) => {
  debug('Authenticating...', _.pick(req.body, requiredProperties));
  return (new User(_.pick(req.body, requiredProperties)).authenticateUser()
    .then((result) => {
      debug(result);
      return res.header('x-auth-token', result).status(200).json({
        success: true,
        payload: result,
      });
    }));
}));

module.exports = router;
