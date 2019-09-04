
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
    if (
      this.data.username === 'undefined' || this.data.username === 0 || this.data.username === null
      || this.data.firstname === 'undefined' || this.data.firstname === 0 || this.data.firstname === null
      || this.data.lastname === 'undefined' || this.data.lastname === 0 || this.data.lastname === null
      || this.data.firstname === 'undefined' || this.data.firstname === 0 || this.data.firstname === null
      || this.data.password === 'undefined' || this.data.password === 0 || this.data.password === null
      || this.data.birthyear === 'undefined' || this.data.birthyear === 0 || this.data.birthyear === null
      || this.data.optional === 'undefined' || this.data.optional === 0 || this.data.optional === null
      || this.data.isAdmin === 'undefined' || this.data.isAdmin === 0 || this.data.isAdmin === null
    ) this.data = null;
  }

  validate() {
    return new Promise((resolve, reject) => {
      const sch = {};

      if (this.req.username) sch.username = Joi.string().alphanum().min(4).max(30).required();
      else sch.username = Joi.string().alphanum().min(4).max(30);

      if (this.req.firstname) sch.firstname = Joi.string().regex(/^[a-zA-Z]{3,30}$/).required();
      else sch.firstname = Joi.string().regex(/^[a-zA-Z]{3,30}$/);

      if (this.req.lastname) sch.lastname = Joi.string().regex(/^[a-zA-Z]{3,30}$/).required();
      else sch.lastname = Joi.string().regex(/^[a-zA-Z]{3,30}$/);

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

      Joi.validate(this.data, sch, (err, value) => {
        if (err === null) resolve({ success: true, value });
        else reject(err);
      });
    });
  }
}

module.exports = Validator;
