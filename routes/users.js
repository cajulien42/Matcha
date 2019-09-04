const debug = require('debug')('app:route_user');
const _ = require('lodash');
const express = require('express');
const identify = require('../middleware/identify');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const handler = require('../middleware/handler');

const router = express.Router();
const User = require('../models/users');

const validProperties = ['username', 'firstname', 'lastname', 'password', 'email', 'birthyear', 'optional'];
const publicProperties = ['username', 'email', 'birthyear', 'optional'];

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get('/', handler(async (req, res) => {
  debug('Requesting user list...');
  return (new User().getUsers()
    .then(users => (
      res.status(200).json({
        success: true,
        payload: { value: 'read', users },
      })
    ))
  );
}));

router.get('/:username', [auth, identify], handler(async (req, res) => {
  debug('Request to get user information for :', req.params.username);
  return (new User(req.params.username).getUserInfo()
    .then((user) => {
      const result = _.pick(user, publicProperties);
      return res.status(200).json({
        success: true,
        payload: { value: 'read', result },
      });
    }));
}));

router.post('/', handler(async (req, res) => {
  debug('Request to add new user :\n', _.pick(req.body, validProperties));
  return (new User(_.pick(req.body, validProperties)).createUser()
    .then(user => (
      res.status(200).json({
        success: true,
        payload: { value: 'create', user },
      })
    )));
}));

router.put('/:username', [auth, identify], handler(async (req, res) => {
  debug('Request to update :\n', _.pick(req.body, validProperties));
  return (new User(_.pick(req.body, validProperties)).updateUser()
    .then(user => (
      res.status(200).json({
        success: true,
        payload: { value: 'update', user },
      })
    )));
}));

router.delete('/:username', [auth, admin], handler(async (req, res) => {
  debug('Request to delete :', req.params.username);
  return (new User(req.params.username).deleteUser()
    .then(user => (
      res.status(200).json({
        success: true,
        payload: { value: 'delete', user },
      })
    )));
}));

module.exports = router;
