const debug = require('debug')('app:route_user');
const identify = require('../middleware/identify');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const User = require('../models/users');

const validProperties = ['username', 'password', 'email', 'birthyear', 'optional'];
const publicProperties = ['username', 'email', 'birthyear', 'optional'];

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/', async (req, res) => {
  debug('Requesting user list...');
  new User().getUsers()
    .then((users) => {
      return res.status(200).json({
        success: true,
        payload: {value: 'read', users},
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        payload: err,
      });
    })
});

router.get('/:username', [auth, identify] , async (req, res) => {
  debug('Request to get user information for :', req.params.username);
  new User(req.params.username).getUserInfo()
    .then((user) => {
      const result = _.pick(user, publicProperties);
      return res.status(200).json({
        success: true,
        payload: {value: 'read', result},
      });
    })
    .catch((err) => {
      debug(err);
      return res.status(500).json({
        success: false,
        payload: err,
      });
    })
});

router.post('/', async (req, res) => {
  debug('Request to add new user :\n',_.pick(req.body, validProperties));
  new User(_.pick(req.body, validProperties)).createUser()
    .then((user) => {
      return res.status(200).json({
        success: true,
        payload: {value: 'create' ,user},
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        payload: err,
      });
    })
});

router.put('/:username', [auth, identify] , async (req, res) => {
  debug('Request to update :\n', _.pick(req.body, validProperties));
   new User(_.pick(req.body, validProperties)).updateUser()
    .then((user) => {
      return res.status(200).json({
        success: true,
        payload: {value: 'update',user},
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        payload: err,
      });
    })
});

router.delete('/:username', [auth, admin] , async (req, res) => {
  debug('Request to delete :', req.params.username);
  new User(req.params.username).deleteUser()
  .then((user) => {
    return res.status(200).json({
      success: true,
      payload: {value: 'delete', user},
    });
  })
  .catch((err) => {
    return res.status(500).json({
      success: false,
      payload: err,
    });
  })
});
  
module.exports = router;
