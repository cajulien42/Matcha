
const debug = require('debug')('app:model_user');
const config = require('config');
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const Validator = require('./validator');
const User = require('./users');

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
const session = driver.session();

class Relationships extends User {

  constructor(users) {
    super();
    if (users.user_a && users.user_b && users.relation) this.users = users;
    else return false;
  }

  addRelationShip() {
    return new Promise((resolve, reject) => {
      debug(this.users.user_a, this.users.user_b, this.users.relation);
      const query = `MATCH (a:User {username: '${this.users.user_a}'}), (b:User {username: '${this.users.user_b}'}) CREATE (a)-[r:${this.users.relation}]->(b) RETURN type(r)`;
      session.run(query)
        .then((res) => {
          session.close();
          debug('HAHA', res.records[0]._fields);
          resolve(res);
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    });
  }
}

module.exports = Relationships;
