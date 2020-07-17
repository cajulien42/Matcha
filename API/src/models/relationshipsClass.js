/* eslint-disable max-len */
/* eslint-disable camelcase */

const debug = require('debug')('models:relationships');
const config = require('config');
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const RelationshipValidator = require('../validation/relationships');
const driver = require('../util/driver');

class Relationship {

  constructor(data) {
    this.data = data;
    this.iDs = ['id', 'username'];
    if (this.data && this.data.node_a) this.id_a = this.data.node_a.id;
    if (this.data && this.data.node_b) this.id_b = this.data.node_b.id;
    this.driver = driver;
    debug('Relationship constructor called');
    this.relevantProperties = [
      'firsname',
      'age',
      'gender',
      'sexOrient',
      'bio',
      'photos',
      'username',
    ];
  }

  wrapper(method, requirements) {
    return new Promise((resolve, reject) => {
      new RelationshipValidator(requirements, this.data).validate()
        .then(() => method())
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  getRelationships() {
    const requirements = {
      node_a: false,
      node_b: false,
      relation: true,
    };
    const method = () => (new Promise((resolve, reject) => {
      const query = `MATCH (a)-[r:${this.data.relation.label}]->(b) return (a)-[r]->(b)`;
      const session = this.driver.session();
      session.run(query)
        .then((res) => {
          session.close();
          if (res.records.length !== 0) {
            const result = [];
            res.records.forEach((record) => {
              const node_a = _.pick(record._fields[0][0].start.properties, this.iDs);
              const relation = this.data.relation.label;
              const node_b = _.pick(record._fields[0][0].end.properties, this.iDs);
              result.push({ node_a, relation, node_b });
            });
            debug(result);
            resolve(result);
          } else resolve('No such relation yet');
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    }));
    return (this.wrapper(method, requirements));
  }

  getNodeRelationships() {
    const requirements = {
      node_a: true,
      node_b: false,
      relation: false,
    };
    const method = () => (new Promise((resolve, reject) => {
      const query = `MATCH (a:${this.data.node_a.label} {${this.data.node_a.id}: '${this.data.node_a.properties[this.id_a]}'})-[r]->(b)
                    return [r]->(b)`;
      const session = this.driver.session();
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
    }));
    return (this.wrapper(method, requirements));
  }

  getNodeMutualRelationships() {
    const requirements = {
      node_a: true,
      relation: true,
    };
    const method = () => (new Promise((resolve, reject) => {
      const query = `MATCH (a:User {username:'${this.data.node_a.properties.username}'})-[r:${this.data.relation.label}]->(b),(b)-[l:${this.data.relation.label}]->(a)
                    WHERE NOT (a)-[:BLOCK]-(b)
                    WITH a, collect(properties(b)) as targets
                    return (targets)`;
      const session = this.driver.session();
      session.run(query)
        .then((res) => {
          const list = [];
          session.close();
          debug(res.records);
          res.records.forEach((record) => {
            list.push(record._fields[0]);
          });
          debug(_.uniq(list));
          resolve(_.uniq(list));
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    }));
    return (this.wrapper(method, requirements));
  }

  getMatches(type) {
    const requirements = {
      node_a: false,
      relation: false,
    };
    const method = () => (new Promise((resolve, reject) => {
      const query = `MATCH (a)-[r:${type}]->(b),(a)<-[p:${type}]-(b)
                    WITH a, collect(b.username) as targets
                    RETURN (a.username),(targets)`;
      const session = this.driver.session();
      session.run(query)
        .then((res) => {
          const list = [];
          session.close();
          debug(res.records);
          res.records.forEach((record) => {
            list.push({ user: record._fields[0], matches: record._fields[1] });
          });
          // debug(_.uniq(list));
          resolve(_.uniq(list));
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    }));
    return (this.wrapper(method, requirements));
  }

  getNodetypeofRelationships() {
    const requirements = {
      node_a: false,
      node_b: false,
      relation: true,
    };
    const method = () => (new Promise((resolve, reject) => {
      const query = `MATCH (a:${this.data.node_a.label} {${this.data.node_a.id}: '${this.data.node_a.properties[this.id_a]}'})-[r:${this.data.relation.label}]-(b)
                    WITH a, collect(DISTINCT properties(b)) as users, collect(b.id) as tags
                    RETURN users,tags`;
      const session = this.driver.session();
      session.run(query)
        .then((res) => {
          session.close();
          if (res.records.length !== 0) {
            const users = res.records[0]._fields[0].map(user => (_.pick(user, this.relevantProperties)));
            // debug(res.records[0]._fields[1]);
            // eslint-disable-next-line no-unused-expressions
            res.records[0]._fields[0].length !== 0 ? resolve(_.uniq(users)) : debug(res.records[0]._fields[1]); resolve(_.uniq(res.records[0]._fields[1]));
          } else resolve([]);
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    }));
    return (this.wrapper(method, requirements));
  }

  toggleRelationship() {
    const requirements = {
      node_a: true,
      node_b: true,
      relation: true,
    };
    const method = () => (new Promise((resolve, reject) => {
      const query = `MATCH (a:${this.data.node_a.label} {${this.data.node_a.id}: '${this.data.node_a.properties[this.id_a]}'})-[r:${this.data.relation.label}]->(b:${this.data.node_b.label} {${this.data.node_b.id}: '${this.data.node_b.properties[this.id_b]}'})
                    RETURN (a)-[r:${this.data.relation.label}]->(b)`;
      const session = this.driver.session();
      debug(query);
      session.run(query)
        .then((res) => {
          session.close();
          debug(res.records);
          if (res.records.length === 0) {
            debug('RELATION FOUND');
            resolve(this.createRelationship());
          } else resolve(this.deleteRelationship());
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    }));
    return (this.wrapper(method, requirements));
  }

  createRelationship() {
    const requirements = {
      node_a: true,
      node_b: true,
      relation: true,
    };
    const method = () => (new Promise((resolve, reject) => {
      debug(this.data.relation.properties);
      const query = `MATCH (a:${this.data.node_a.label} {${this.data.node_a.id}: '${this.data.node_a.properties[this.id_a]}'}), (b:${this.data.node_b.label} {${this.data.node_b.id}: '${this.data.node_b.properties[this.id_b]}'})
                    CREATE (a)-[r:${this.data.relation.label} $props]->(b)
                    RETURN (a)-[r:${this.data.relation.label}]->(b)`;
      const session = this.driver.session();
      const props = this.data.relation.properties;
      // debug(query);
      session.run(query, { props })
        .then((res) => {
          session.close();
          if (res.records.length !== 0) {
            debug(`${this.data.node_a.properties[this.id_a]} ${this.data.relation.label} ${this.data.node_b.properties[this.id_b]} RELATION CREATED`);
            resolve(`${this.data.node_a.properties[this.id_a]} ${this.data.relation.label} ${this.data.node_b.properties[this.id_b]} RELATION CREATED`);
          } resolve(false);
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    }));
    return (this.wrapper(method, requirements));
  }

  deleteRelationship() {
    const requirements = {
      node_a: true,
      node_b: true,
      relation: true,
    };
    const method = () => (new Promise((resolve, reject) => {
      const query = `MATCH (a:${this.data.node_a.label} {${this.data.node_a.id}: '${this.data.node_a.properties[this.id_a]}'})-[r:${this.data.relation.label}]->(b:${this.data.node_b.label} {${this.data.node_b.id}: '${this.data.node_b.properties[this.id_b]}'})
                    DELETE r 
                    return type(r)`;
      const session = this.driver.session();
      session.run(query)
        .then((res) => {
          session.close();
          if (res.records.length !== 0) {
            debug(`${this.data.node_a.properties[this.id_a]} ${this.data.relation.label} ${this.data.node_b.properties[this.id_b]} RELATION DESTROYED`);
            resolve(`${this.data.node_a.properties[this.id_a]} ${this.data.relation.label} ${this.data.node_b.properties[this.id_b]} RELATION DESTROYED`);
          } else resolve('No such relationship');
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    }));
    return (this.wrapper(method, requirements));
  }

  deleteThisNodeRelationships() {
    const requirements = {
      node_a: true,
    };
    const method = () => (new Promise((resolve, reject) => {
      const query = `MATCH (a)-[r]->(b)
                    WHERE a.${this.data.node_a.id}='${this.data.node_a.properties[this.id_a]}'
                    OR b.${this.data.node_a.id}='${this.data.node_a.properties[this.id_a]}'
                    DELETE r 
                    return type(r)`;
      const session = this.driver.session();
      session.run(query)
        .then((res) => {
          session.close();
          debug('Relationships destroyed for :', this.data.node_a.properties[this.id_a]);
          resolve(`Relationships destroyed for : ${this.data.node_a.properties[this.id_a]}`);
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    }));
    return (this.wrapper(method, requirements));
  }

  deleteThisTypeofRelationship() {
    const requirements = {
      relation: true,
    };
    const method = () => (new Promise((resolve, reject) => {
      const query = `MATCH (a)-[r:${this.data.relation.label}]->(b)
                    DELETE r
                    RETURN type(r)`;
      const session = this.driver.session();
      session.run(query)
        .then((res) => {
          session.close();
          if (res.records.length !== 0) {
            debug(res.records[0]._fields);
            resolve(`${this.data.relation.label} DESTROYED`);
          } else resolve('No such relationship');
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    }));
    return (this.wrapper(method, requirements));
  }

  deleteThisNodelabelofRelationships() {
    const requirements = {
      node_a: true,
      relation: true,
    };
    const method = () => (new Promise((resolve, reject) => {
      const query = `MATCH (a)-[r:${this.data.relation.label}]->(b)
                    WHERE a.${this.data.node_a.id}='${this.data.node_a.properties[this.id_a]}'
                    OR b.${this.data.node_a.id}='${this.data.node_a.properties[this.id_a]}'
                    DELETE r
                    return type(r)`;
      const session = this.driver.session();
      session.run(query)
        .then((res) => {
          session.close();
          debug('Relationships destroyed for :', this.data.node_a.properties[this.id_a]);
          resolve(`${this.data.relation.label} Relations destroyed for ${this.data.node_a.properties[this.id_a]}`);
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    }));
    return (this.wrapper(method, requirements));
  }

  deleteRelationshipsDuplicates(labela, reltype, labelb) {
    const requirements = {
      node_a: false,
      relation: false,
    };
    const method = () => (new Promise((resolve, reject) => {
      const query = `MATCH (n:${labela})-[r:${reltype}]->(m:${labelb})
      WITH n, m, collect(r)[1..] as rels
      FOREACH (r in rels | DELETE r)`;
      const session = this.driver.session();
      session.run(query)
        .then((res) => {
          session.close();
          debug(`${reltype} relationships duplicates destroyed`);
          resolve(res);
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    }));
    return (this.wrapper(method, requirements));
  }
}

module.exports = Relationship;
