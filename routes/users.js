
const debug = require('debug')('app:debug');
const express = require('express');
const Joi = require('@hapi/joi');
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
const session = driver.session();
const router = express.Router();
const populate = require('../database/users');
const User = require('../models/users');


router.use(express.json()); //populate req.body
router.use(express.urlencoded({ extended: true })); //key=value&...

function validateUser(user) {
  const schema = {
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    birthyear: Joi.number().integer().min(1900).max(2001).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required()
  };
  return Joi.validate(user, schema);
}

// Reset and Populate DB with garbage data
populate();

router.get('/', (req, res) => {
  let resultPromise = session.run(
    'MATCH (n:User) RETURN n.username'
    );
  resultPromise
    .then(result => {
      if (result.records.length !== 0) {
        users = [];
        result.records.forEach(record => {
        let user = {username: record._fields[0]};
        users.push(user.username);
        });
        res.json({users});
      }
      else {
        return res.status(404).send('No Users');
      }
    })
    .catch(err => { console.log(err)});
});

router.get('/:username', (req, res) => {
  let resultPromise = session.run(
    'MATCH (n:User) WHERE n.username=$username RETURN n',
    {username: req.params.username}
    );
  resultPromise
    .then(result => {
      if (result.records.length === 1) {
        let user = {username: result.records[0]._fields[0].properties.username, password: result.records[0]._fields[0].properties.password, email: result.records[0]._fields[0].properties.email, birthyear: result.records[0]._fields[0].properties.birthyear};
        res.json({user});
      }
      else { 
        return res.status(404).send('User not found');
      }
    })
    .catch(err => { console.log(err)});
});

router.post('/', (req, res) => (
  new User(req.body).createUser()
    .then((user) => {
      // console.log('It works.');
      return res.status(200).json({
        success: true,
        payload: user,
      });
    })
    .catch((err) => {
      // console.log('It doesnt work');
      return res.status(500).json({
        success: false,
        payload: err,
      });
    })
));

router.put('/:username', (req, res) => {
   new User(req.body).updateUser()
    .then((user) => {
      return res.status(200).json({
        success: true,
        payload: user,
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
