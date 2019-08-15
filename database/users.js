
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
const session = driver.session();
const User = require('../models/users');
const _ = require('lodash');
const debug = require('debug')('app:debug');

const requiredProperties = ['username', 'password', 'email', 'birthyear'];
const optionalProperties = ['optional'];
const users = [
  {
    username: 'Jean',
    password : 'Test123*',
    email: 'jean@gmail.com',
    birthyear: '1905'
  },
  {
    username: 'Bob',
    password : 'Test123*',
    email: 'marley@gmail.com',
    birthyear: '1906'
  },
  {
    username: 'Pilip',
    password : 'Test123*',
    email: 'pilip@gmail.com',
    birthyear: '1998'
  },
  {
    username: 'Claude',
    password : 'Test123*',
    email: 'claude@gmail.com',
    birthyear: '2000'
  },
];

function resetDb() {
  return new Promise ((resolve) => {
    session.run('MATCH p=()-[r]->() DELETE p')
    .then(() => {session.run('MATCH (n) DELETE n')})
    .then(() => resolve(true))
    .catch(err => debug(err));
  });
}

function populateUsers() {
  return new Promise ((resolve) => {
    resetDb()
    .then(() => {
      users.forEach((user) => {
        new User(_.pick(user, requiredProperties.concat(optionalProperties))).createUser()
      });
      session.run(
        'MATCH (a:User), (b:User) WHERE a.username=$a_username AND b.username=$b_username CREATE (a)-[r:LIKES]->(b) RETURN r',
        {a_username: 'Claude', b_username: 'Bob'}
      )
      .then(() => {session.close()})
      .catch(err => debug(err));
    })
    .then(() => resolve(true))
    .catch(err => debug(err));
  })
}

module.exports = populateUsers;