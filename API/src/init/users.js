

const debug = require('debug')('init:users');
const _ = require('lodash');
const fs = require('fs');

const User = require('../models/userClass');

const requiredProperties = ['username', 'firstName', 'lastName', 'password', 'email', 'birthdate'];
const optionalProperties = ['bio', 'lat', 'lon', 'lastConnection', 'complete', 'gender', 'sexOrient', 'ageMin', 'ageMax', 'tags', 'isTags', 'active', 'photos', 'localisation', 'optional', 'isAdmin'];

function getUsers() {
  return new Promise(async (resolve, reject) => {
    await fs.readFile('./src/init/seedPROD.json', (err, data) => {
      const res = data;
      const users = JSON.parse(res);
      resolve(users);
    });
  });
}

// function populateUsers() {
//   return (getUsers()
//     .then((users) => {
//       const promises = users.map(user => (
//        new User(_.pick(user, requiredProperties.concat(optionalProperties))).createUser())
//          );
//       return Promise.all(promises);
//     }));
// }

function populateUsers() {
  return (getUsers()
    .then(users => (users.reduce(async (previousUser, nextUser) => {
      await previousUser;
      return new User(_.pick(nextUser, requiredProperties.concat(optionalProperties))).createUser();
    }, Promise.resolve()))));
}

module.exports = populateUsers;
