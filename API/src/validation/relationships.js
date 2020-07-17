const Joi = require('@hapi/joi');
const debug = require('debug')('validation:relationships');
const UserValidator = require('./users');
const TagValidator = require('./tags');

class RelationshipValidator {

  constructor(requirements, data) {
    this.req = requirements;
    this.data = data;
    if (this.data && (this.data.relation === 'undefined' || this.data.relation === 0 || this.data.relation === null)
    ) this.data = null;
    debug('Validating relationship data...');
  }

  validateNodea() {
    return new Promise((resolve) => {
      if (this.req.node_a && this.data.node_a.label === 'User') {
        resolve(new UserValidator({ username: true }, this.data.node_a.properties).validate());
      } else if (this.req.node_a && this.data.node_a.label === 'Tag') {
        resolve(new TagValidator({ id: true }, this.data.node_a.properties).validate());
      } else resolve(true);
    });
  }

  validateNodeb() {
    return new Promise((resolve) => {
      if (this.req.node_b && this.data.node_b.label === 'User') {
        resolve(new UserValidator({ username: true }, this.data.node_b.properties).validate());
      } else if (this.req.node_b && this.data.node_b.label === 'Tag') {
        resolve(new TagValidator({ id: true }, this.data.node_b.properties).validate());
      } else resolve(true);
    });
  }

  validateRelationship() {
    return new Promise((resolve, reject) => {
      const sch = {};

      if (this.req.relation) sch.relation = Joi.string().regex(/^[a-zA-Z-_]{2,30}$/).required();
      else sch.relation = Joi.string().regex(/^[a-zA-Z-_]{2,30}$/);

      if (this.data.relation) {
        Joi.validate({ relation: this.data.relation.label }, sch, (err, value) => {
          if (err === null) resolve({ success: true, value });
          else {
            debug(err);
            reject(err);
          }
        });
      } else resolve(true);

    });
  }

  validate() {
    return new Promise((resolve, reject) => {
      if (this.data) {
        this.validateNodea()
          .then(() => this.validateNodea())
          .then(() => this.validateNodeb())
          .then(() => this.validateRelationship())
          .then(res => resolve(res))
          .catch(err => reject(err));
      } else resolve(true);
    });
  }

}

module.exports = RelationshipValidator;
