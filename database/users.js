
const neo4j = require('neo4j-driver').v1;
const debug = require('debug')('app:startup');
const _ = require('lodash');
const User = require('../models/users');
const RelationShips = require('../models/relationships');

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
const session = driver.session();


const requiredProperties = ['username', 'password', 'email', 'birthyear'];
const optionalProperties = ['optional', 'isAdmin'];
const users = [
  {
    username: 'Jean',
    password: 'Test123*',
    email: 'jean@gmail.com',
    birthyear: '1905',
  },
  {
    username: 'Camille',
    password: 'Test123*',
    email: 'kamillejulien@gmail.com',
    birthyear: '1905',
    isAdmin: 'true',
  },
  {
    username: 'Bob',
    password: 'Test123*',
    email: 'marley@gmail.com',
    birthyear: '1906',
  },
  {
    username: 'Pilip',
    password: 'Test123*',
    email: 'pilip@gmail.com',
    birthyear: '1998',
  },
  {
    username: 'Claude',
    password: 'Test123*',
    email: 'claude@gmail.com',
    birthyear: '2000',
  },
];

const relationships = {
  user_a: 'Jean',
  user_b: 'Bob',
  relation: 'LIKES',
};

function resetDb() {
  return new Promise((resolve) => {
    debug('Reseting DB...');
    session.run('MATCH p=()-[r]->() DELETE p')
      .then(() => (session.run('MATCH (n) DELETE n')))
      .then(() => resolve(true))
      .catch(err => debug(err));
  });
}

function populateUsers() {
  const promises = [];
  debug('Populating DB...');
  users.forEach((user) => {
    const p = new User(_.pick(user, requiredProperties.concat(optionalProperties))).createUser();
    promises.push(p);
  });
  return Promise.all(promises);
}

function createRelationships() {
  return new Promise((resolve, reject) => {
    debug('Creating Relationships...');
    new RelationShips(relationships).addRelationShip()
      .then(() => resolve(true))
      .catch(err => reject(err));
  });
}

function populateDb() {
  return new Promise((resolve, reject) => {
    resetDb()
      .then(() => populateUsers())
      .then(() => createRelationships())
      .then(() => resolve(true))
      .catch(err => reject(err));
  });
}

module.exports = populateDb;
