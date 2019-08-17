
const Joi = require('@hapi/joi');
const PasswordComplexity = require('joi-password-complexity');

class Validator {

  constructor(requirements, data) {
    this.required = requirements;
    this.data = data;
    this.passwordRequirements = {
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
    return new Promise ((resolve) => {
      const schema = {};
      if (this.required.username) schema.username = Joi.string().alphanum().min(3).max(30).required()
      else schema.username = Joi.string().alphanum().min(3).max(30)
      if (this.required.password) schema.password = new PasswordComplexity(this.passwordRequirements).required()
      else schema.password = new PasswordComplexity(this.passwordRequirements)
      if (this.required.birthyear) schema.birthyear = Joi.number().integer().min(1900).max(2001).required()
      else schema.birthyear = Joi.number().integer().min(1900).max(2001)
      if (this.required.email) schema.email = Joi.string().email({ minDomainSegments: 2 }).required()
      else schema.email = Joi.string().email({ minDomainSegments: 2 })
      if (this.required.optional) schema.optional = Joi.string().alphanum().min(3).max(30).required()
      else schema.optional = Joi.string().alphanum().min(3).max(30)
      if (this.required.isAdmin) schema.isAdmin = Joi.string().alphanum().min(3).max(30).required()
      else schema.isAdmin = Joi.string().alphanum().min(3).max(30)
      resolve (Joi.validate(this.data, schema));
    });
  }
}

module.exports = Validator;