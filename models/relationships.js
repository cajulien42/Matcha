
const debug = require('debug')('app:model_user');
const config = require('config');
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const Validator = require('./validator');
const User = require('./users');

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
const session = driver.session();

class Relationships extends User {

  constructor(relation) {
    super();
    if (relation.user_a && relation.user_b && relation.type) this.relation = relation;
    else if (relation.type) this.relation = relation;
    else return false;
  }

  addRelationShip() {
    return new Promise((resolve, reject) => {
      debug(this.relation.user_a, this.relation.user_b, this.relation.type);
      const query = `MATCH (a:User {username: '${this.relation.user_a}'}), (b:User {username: '${this.relation.user_b}'}) CREATE (a)-[r:${this.relation.type}]->(b) RETURN type(r)`;
      session.run(query)
        .then((res) => {
          session.close();
          debug(res.records[0]._fields);
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
