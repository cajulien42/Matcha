const debug = require('debug')('app:debug');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const User = require('../models/users');


router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const requiredProperties = ['username', 'password', 'email', 'birthyear'];
const optionalProperties = ['optional'];

router.get('/', async (req, res) => {
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

router.get('/:username', async (req, res) => {
  new User(req.params.username).getUserInfo()
    .then((user) => {
      const result = _.pick(user, ['username','email','birthyear']);
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

router.post('/', async (req, res) => (
  new User(_.pick(req.body, requiredProperties.concat(optionalProperties))).createUser()
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
));

router.put('/:username', async (req, res) => {
   new User(_.pick(req.body, requiredProperties.concat(optionalProperties))).updateUser()
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

router.delete('/:username', (req, res) => {
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
