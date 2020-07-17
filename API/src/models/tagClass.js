
const debug = require('debug')('models:tags');
const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const bcrypt = require('bcrypt');
const Tagvalidator = require('../validation/tags');
const Node = require('./nodeClass');


class Tag extends Node {

  constructor(data) {

    const node = {
      label: 'Tag',
      id: 'id',
      properties: data,
    };
    super({ node_a: node });
    this.data = { node_a: node };
    this.tag = this.data.node_a.properties;
    this.allProperties = ['id', 'text'];
    this.publicProperties = ['id', 'text'];
    this.creationRequirements = {
      id: true,
      text: true,
    };
    this.getRequirements = {
      id: true,
    };
    this.updateRequirements = {
      id: true,
    };
    this.deleteRequirements = {
      id: true,
    };
    this.getRequirements = {
      id: true,
    };
    debug('tag constructor called:');
  }

  getList(value) {
    return new Promise((resolve, reject) => {
      this.getNodeList(value)
        .then(list => resolve(list))
        .catch(err => reject(err));
    });
  }

  getTagInfo() {
    return new Promise((resolve, reject) => {
      debug('Getting tag info for :', this.tag);
      new Tagvalidator(this.getRequirements, this.tag).validate()
        .then(() => this.getNodeInfo())
        .then(tag => resolve(tag))
        .catch(err => reject(err));
    });
  }

  createTag() {
    return new Promise((resolve, reject) => (
      new Tagvalidator(this.creationRequirements, this.tag).validate()
        .then(() => this.redundancyCheck())
        .then(() => this.createNode())
        .then(tag => resolve(_.pick(tag, this.allProperties)))
        .catch(err => reject(err))
    ));
  }

  updateTag(newData) {
    return new Promise((resolve, reject) => (
      this.updateNode(newData)
        .then(tag => resolve(_.pick(tag, this.allProperties)))
        .catch(err => reject(err))
    ));
  }

  deleteTag() {
    return new Promise((resolve, reject) => (
      new Tagvalidator(this.deleteRequirements, this.tag).validate()
        .then(() => this.deleteThisNodeRelationships())
        .then(() => this.deleteNode())
        .then(tag => resolve(tag))
        .catch(err => reject(err))
    ));
  }

  deleteTagsDuplicates() {
    return new Promise((resolve, reject) => {
      this.data = {
        node_a: {
          label: 'Tag',
          id: 'id',
        },
      };
      this.deleteNodeDuplicates()
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }
}

module.exports = Tag;
