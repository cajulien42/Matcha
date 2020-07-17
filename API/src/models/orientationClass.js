const debug = require('debug')('models:orientation');
const config = require('config');
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const Node = require('./nodeClass');

class Orientation extends Node {

  constructor(data) {
    const node = {
      label: 'Orientation',
      id: 'id',
      properties: data,
    };
    super({ node_a: node });
    this.data = { node_a: node };
    debug('Orientation constructor called');
  }

  createOrientation() {
    return new Promise((resolve, reject) => {
      this.createNode()
        .then(() => resolve())
        .catch(err => reject(err));
    });
  }
}

module.exports = Orientation;
