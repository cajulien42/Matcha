/* eslint-disable prefer-destructuring */
const debug = require('debug')('models:node');
const config = require('config');
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const Relationship = require('./relationshipsClass');
const userTemplate = require('../util/userTemplate');
const tagTemplate = require('../util/tagTemplate');
const driver = require('../util/driver');


class Node extends Relationship {

  constructor(data) {

    super(data);
    this.data = data;
    this.iDs = ['id', 'username'];
    this.unique = {
      User: [],
      Tag: [],
    };

    Object.keys(userTemplate).forEach((property) => {
      if (userTemplate[property].unique === true) this.unique.User.push(property);
    });
    Object.keys(tagTemplate).forEach((property) => {
      if (tagTemplate[property].unique === true) this.unique.Tag.push(property);
    });

    if (this.data && this.data.node_a) this.id_a = this.data.node_a.id;
    debug('Node constructor called', this.data);
    this.driver = driver;
  }

  redundancyCheck() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query1 = `MATCH (n:${this.data.node_a.label}) WHERE n.${this.unique[this.data.node_a.label][0]}='${this.data.node_a.properties[this.unique[this.data.node_a.label][0]]}' OR `;
      const query2 = this.unique[this.data.node_a.label][1] ? `n.${this.unique[this.data.node_a.label][1]}='${this.data.node_a.properties[this.unique[this.data.node_a.label][1]]}' RETURN n` : 'false RETURN n';
      const query = query1 + query2;
      session.run(query)
        .then((result) => {
          // debug(result);
          session.close();
          if (result.records.length === 0) {
            resolve(this.data.node_a);
          } else reject(new Error('Node exists'));
        })
        .catch(err => reject(err));
    });
  }

  getNodeList(value) {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      session.run(`MATCH (n:${this.data.node_a.label}) RETURN n.${value} LIMIT 1000`)
        .then((res) => {
          session.close();
          if (res.records.length !== 0) {
            this.result = [];
            res.records.forEach((record) => { this.result.push(record._fields[0]); });
            // debug('Records :\n', this.result);
            resolve(this.result);
          } else resolve(`No ${this.data.node_a.label} in database`);
        })
        .catch(err => reject(err));
    });
  }

  getNodeInfo() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (n:${this.data.node_a.label} {${this.data.node_a.id}:'${this.data.node_a.properties[this.id_a]}'}) RETURN n`;
      session.run(query)
        .then((res) => {
          session.close();
          if (res.records.length !== 0) {
            const result = res.records[0]._fields[0].properties;
            debug('Data fetched :\n', result);
            resolve(result);
          } else resolve(`${this.data.node_a.label} does not exist`);
        })
        .catch(err => reject(err));

    });
  }

  updateNode(newData) {
    return new Promise((resolve, reject) => {
      this.props = _.omit(this.data.node_a.properties, 'tags', 'isTags');
      Object.keys(newData).forEach((key) => {
        if (newData[key] && key !== 'tags' && key !== 'isTags') this.props[key] = newData[key];
      });
      this.props.confToken = newData.confToken;
      const props = this.props;
      const session = this.driver.session();
      session.run(
        `MATCH (n:${this.data.node_a.label} {${this.data.node_a.id}:'${this.data.node_a.properties[this.id_a]}'}) SET n+=$props RETURN n`,
        { props },
      )
        .then((result) => {
          session.close();
          if (result.records.length === 1) {
            const singleRecord = result.records[0];
            const node = singleRecord.get(0);
            debug(`Updated ${this.data.node_a.label}: ${this.data.node_a.properties}`);
            resolve(node.properties);
          } else reject(new Error(`Informations does not match existing ${this.data.node_a.label}`));
        })
        .catch(err => reject(err));
    });
  }

  createNode() {
    return new Promise((resolve, reject) => {
      const date = new Date().toLocaleString();
      this.data.node_a.properties.creationDate = date;
      const props = _.omit(this.data.node_a.properties, 'tags', 'isTags');
      const session = this.driver.session();
      session.run(`CREATE (n:${this.data.node_a.label} $props) RETURN n`, { props })
        .then((result) => {
          session.close();
          if (result.records.length === 1) {
            const singleRecord = result.records[0];
            const node = singleRecord.get(0);
            resolve(debug(`${this.data.node_a.label} added to DB : ${this.data.node_a.properties[this.id_a]}`));
          } else reject(new Error(`${this.data.node_a.label} could not be created`));
        })
        .catch(err => reject(err));
    });
  }

  deleteNode() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (n:${this.data.node_a.label} {${this.data.node_a.id}:'${this.data.node_a.properties[this.id_a]}'}) DELETE n RETURN n`;
      session.run(query)
        .then((result) => {
          session.close();
          if (result.records.length === 1) {
            debug('Deleted Node :', this.data.node_a.properties[this.id_a]);
            resolve(this.data.node_a.properties[this.id_a]);
          } else reject(new Error(`No such ${this.data.node_a.label}`));
        })
        .catch(err => reject(err));
    });
  }

  deleteNodeDuplicates() {
    return new Promise((resolve, reject) => {
      const query1 = `MATCH (g:${this.data.node_a.label}) 
      WITH g.${this.data.node_a.id} as id, collect(g) AS nodes 
      WHERE size(nodes) >  1
      UNWIND tail(nodes) as tails
      MATCH (tails)-[r]-()
      DELETE r`;
      const query2 = `MATCH (g:${this.data.node_a.label}) 
      WITH g.${this.data.node_a.id} as id, collect(g) AS nodes 
      WHERE size(nodes) >  1
      FOREACH (g in tail(nodes) | DELETE g)`;
      let session = this.driver.session();
      session.run(query1)
        .then(() => {
          session.close();
        })
        .then(() => {
          session = this.driver.session();
          session.run(query2)
            .then(() => { session.close(); debug(`${this.data.node_a.label} nodes duplicates destroyed`); })
            .then(res => resolve(res))
            .catch(err => reject(err));
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    });
  }
}

module.exports = Node;
