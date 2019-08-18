
const Joi = require('@hapi/joi');
const Complexity = require('joi-password-complexity');

class Validator {

  constructor(requirements, data) {
    this.req = requirements;
    this.data = data;
    this.passwordConf = {
      min: 7,
      max: 20,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 1,
    };
  }

  validate() {
    return new Promise((resolve) => {
      const sch = {};

      if (this.req.username) sch.username = Joi.string().alphanum().min(3).max(30).required();
      else sch.username = Joi.string().alphanum().min(3).max(30);

      if (this.req.password) sch.password = new Complexity(this.passwordConf).required();
      else sch.password = new Complexity(this.passwordConf);

      if (this.req.birthyear) sch.birthyear = Joi.number().integer().min(1900).max(2001).required();
      else sch.birthyear = Joi.number().integer().min(1900).max(2001);

      if (this.req.email) sch.email = Joi.string().email({ minDomainSegments: 2 }).required();
      else sch.email = Joi.string().email({ minDomainSegments: 2 });

      if (this.req.optional) sch.optional = Joi.string().alphanum().min(3).max(30).required();
      else sch.optional = Joi.string().alphanum().min(3).max(30);

      if (this.req.isAdmin) sch.isAdmin = Joi.string().alphanum().min(3).max(30).required();
      else sch.isAdmin = Joi.string().alphanum().min(3).max(30);

      resolve(Joi.validate(this.data, sch));
    });
  }
}

module.exports = Validator;
