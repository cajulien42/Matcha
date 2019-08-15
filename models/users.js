const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
const session = driver.session();
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const PasswordComplexity = require('joi-password-complexity');

class User {

  constructor(user){
    if (user && user.username) this.user = user;
    else if (user) { 
      this.user = {};
      this.user.username = user;
    }
    this.publicProperties = ['username', 'email', 'birthyear'];
    this.optionalProperties = ['optional'];
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
  
  validateUserAuthProperties() {
    return new Promise ((resolve, reject) => {
      const schema = {
        username: Joi.string().alphanum().min(3).max(30).required(),
        password : new PasswordComplexity(this.passwordRequirements).required(),
      };
      resolve (Joi.validate(this.user, schema));
    });
  }

  validateUserProperties() {
    return new Promise ((resolve, reject) => {
      const schema = {
        username: Joi.string().alphanum().min(3).max(30).required(),
        password : new PasswordComplexity(this.passwordRequirements).required(),
        birthyear: Joi.number().integer().min(1900).max(2001),
        email: Joi.string().email({ minDomainSegments: 2 }),
        optional: Joi.string().alphanum().min(3).max(30)
      };
      resolve (Joi.validate(this.user, schema));
    });
  }

  validateNewUser() {
    return new Promise ((resolve, reject) => {
      const schema = {
        username: Joi.string().alphanum().min(3).max(30).required(),
        // password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        password : new PasswordComplexity(this.passwordRequirements).required(),
        birthyear: Joi.number().integer().min(1900).max(2001).required(),
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        optional: Joi.string().alphanum().min(3).max(30)
      };
      resolve (Joi.validate(this.user, schema));
    });
  }

  redundancyCheck() {
    return new Promise ((resolve, reject) => {
      let resultPromise = session.run(
        'MATCH (n:User) WHERE n.username=$username OR n.email=$email RETURN n',
        {username: this.user.username, email: this.user.email}
        );
        resultPromise
          .then(result => {
            if (result.records.length === 0) {
              resolve (this.user);
            }
            else {
              reject('User exists');
            }
          })
          .catch(err => {console.log(err)})
    });
  }

  getUsers() {
    return new Promise ((resolve, reject) => {
      let resultPromise = session.run(
        'MATCH (n:User) RETURN n.username'
        );
      resultPromise
        .then(result => {
          if (result.records.length !== 0) {
            let users = [];
            result.records.forEach(record => {
            let user = {username: record._fields[0]};
            users.push(user.username);
            });
            resolve(users);
          }
          else reject('No users in database')
        })
        .catch(err => { console.log(err)});
    });
  }

  getUserInfo() {
    return new Promise ((resolve, reject) => {
      let resultPromise = session.run(
        'MATCH (n:User) WHERE n.username=$username RETURN n',
        {username: this.user.username}
        );
      resultPromise
        .then(result => {
          if (result.records.length === 1) {
            let user = {username: result.records[0]._fields[0].properties.username, password: result.records[0]._fields[0].properties.password, email: result.records[0]._fields[0].properties.email, birthyear: result.records[0]._fields[0].properties.birthyear};
            resolve(user, ['username','password', 'email', 'birthyear']);
          }
          else reject('bad request');
        })
        .catch(err => { console.log(err)});
    });
  }

  deleteRelationships () {
    return new Promise ((resolve, reject) => {
      let resultPromise = session.run(
        'MATCH p=(a)-[r]->(b) WHERE a.username=$username OR b.username=$username DELETE r',
        {username: this.user.username}
      );
      resultPromise.then(result => {
        session.close();
        resolve(true);
      });
    })
  }

  deleteNode() {
    return new Promise ((resolve, reject) => {
      let resultPromise = session.run(
        'MATCH (n:User) WHERE n.username=$username DELETE n RETURN n',
        {username: this.user.username}
      );
      resultPromise.then(result => {
        session.close();
        if (result.records.length === 1) {
          resolve(this.user.username);
        }
        else reject('User not found')
      });
    })
  }

  changeUserProperies() {
    return new Promise (async (resolve, reject) => {
      const salt = await bcrypt.genSalt(10);
      this.user.password = await bcrypt.hash(this.user.password, salt);
      const newProperties = Object.keys(this.user);
      let changeReq = '{';
      newProperties.forEach((property) => (changeReq = ` ${changeReq}${property} : $${property},`));
      changeReq = `${changeReq}}`;
      changeReq = changeReq.replace(',}', '}');  
      let resultPromise = session.run(
        `MATCH (n:User {username: $username}) SET n+= ${changeReq} RETURN n`,
        this.user
      );
      resultPromise.then(result => {
        session.close();
        if (result.records.length === 1) {
          const singleRecord = result.records[0];
          const node = singleRecord.get(0);
          resolve(node.properties);
        }
        else reject('Informations does not match existing user')
      });
    })
  }

  addUser() {
    return new Promise (async (resolve, reject) => {
      const salt = await bcrypt.genSalt(10);
      this.user.password = await bcrypt.hash(this.user.password, salt);
      const newProperties = Object.keys(this.user);
      let addReq = '{';
      newProperties.forEach((property) => (addReq = ` ${addReq}${property} : $${property},`));
      addReq = `${addReq}}`;
      addReq = addReq.replace(',}', '}');
      let resultPromise = session.run(
        `CREATE (n:User ${addReq}) RETURN n`,
        this.user
      );
      resultPromise.then(result => {
        session.close();
        if (result.records.length === 1) {
          const singleRecord = result.records[0];
          const node = singleRecord.get(0);
          resolve(node.properties);
        }
        else reject('An error occured')
      });
    });
  }

  matchPasswords(user) {
    return new Promise(async (resolve, reject) => {
      const valid = await bcrypt.compare(this.user.password, user.password)
      if (valid) {
        resolve(user);
      }
      else reject('Bad request');
    });
    
  }

  createUser() {
    return new Promise((resolve, reject) => (
      this.validateNewUser()
        .then(() => this.redundancyCheck())
        .then(() => this.addUser())
        .then((user) => resolve(_.pick(user, this.publicProperties.concat(this.optionalProperties))))
        .catch((err) => reject(err))
    ));
  }

  updateUser() {
    return new Promise((resolve, reject) => (
      this.validateUserProperties()
      .then(() => this.changeUserProperies())
      .then((user)=> resolve(_.pick(user, this.publicProperties.concat(this.optionalProperties))))
      .catch(err => reject(err))
    ));
  }

  deleteUser() {
    return new Promise((resolve, reject) => (
      this.validateUserProperties()
      .then(() => this.deleteRelationships())
      .then(() => this.deleteNode())
      .then((user) => resolve(user))
      .catch(err => reject(err))
    ));
  }

  authenticateUser() {
    return new Promise((resolve, reject) => (
      this.validateUserAuthProperties()
        .then(() => this.getUserInfo())
        .then((existingUser) => this.matchPasswords(existingUser))
        .then((existingUser) => resolve(existingUser))
        .catch(err => reject(err))
    ));
  }
}

module.exports = User;