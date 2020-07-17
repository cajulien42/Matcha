const debug = require('debug')('routes:relationships');
const _ = require('lodash');
const express = require('express');
const auth = require('../middleware/auth');
const identify = require('../middleware/identify');
const admin = require('../middleware/admin');
const wrapper = require('../middleware/wrapper');

const router = express.Router();
const Relationship = require('../models/relationshipsClass');
const User = require('../models/userClass');

const validProperties = ['node_a', 'node_b', 'relation'];
const publicProperties = ['node_a', 'node_b', 'relation'];

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get('/type/:type', [auth, admin], wrapper(async (req, res) => {
  debug('Request to get Relationship information for :', req.params.type);
  return (new Relationship({ relation: { label: req.params.type } }).getRelationships()
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'read', result },
      });
    }));
}));

router.get('/mutual', [auth, identify], wrapper(async (req, res) => {
  res.locals.check = req.body.node_a.properties.username;
  debug('Request to get Relationship information for :', req.body);
  return (new Relationship(req.body).getNodeMutualRelationships()
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'read', result },
      });
    }));
}));

router.get('/matches/:relation', [auth, admin], wrapper(async (req, res) => {
  debug('Request to get matches');
  return (new Relationship(req.body).getMatches(req.params.relation)
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'read', result },
      });
    }));
}));

router.post('/create', [auth, admin], wrapper(async (req, res) => {
  debug('Request to add new Relationship :\n', _.pick(req.body, validProperties));
  return (new Relationship(req.body).createRelationship()
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'create', result },
      });
    }));
}));

router.post('/toggle', [auth, identify], wrapper(async (req, res) => {
  res.locals.check = req.body.node_a.properties.username;
  debug('Request to add new Relationship :\n', _.pick(req.body, validProperties));
  return (new Relationship(req.body).toggleRelationship()
    .then((result) => {
      new User({ username: req.body.node_b.properties.username }).updateScore();
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'toggle', result },
      });
    }));
}));

router.delete('/delete/relation', [auth, admin], wrapper(async (req, res) => {
  debug('Request to delete :', req.body.relation);
  return (new Relationship(req.body).deleteRelationship()
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'delete', result },
      });
    }));
}));

router.delete('/delete/node/', [auth, admin], wrapper(async (req, res) => {
  debug('Request to delete :', req.body.node_a);
  return (new Relationship(req.body).deleteThisNodeRelationships()
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'delete', result },
      });
    }));
}));

router.delete('/delete/type', [auth, admin], wrapper(async (req, res) => {
  debug('Request to delete :', req.body.node_a);
  return (new Relationship(req.body).deleteThisTypeofRelationship()
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'delete', result },
      });
    }));
}));

router.delete('/delete/node/type', [auth, admin], wrapper(async (req, res) => {
  debug('Request to delete :', req.body.node_a);
  return (new Relationship(req.body).deleteThisNodeTypeofRelationship()
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'delete', result },
      });
    }));
}));

router.delete('/delete/duplicates', [auth, admin], wrapper(async (req, res) => {
  debug('Request to delete duplicates');
  return (new Relationship(req.body).deleteRelationshipsDuplicates('User', 'COMPATIBLE', 'User')
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'delete', result },
      });
    }));
}));

module.exports = router;
