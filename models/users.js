const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
const session = driver.session();
const Joi = require('@hapi/joi');
const crypto = require('crypto');

class User {
  constructor(user){
    if (user && user.username) this.user = user;
    else if (user) { 
      this.user = {};
      this.user.username = user;
    }
  }
  
  validateUserAuthProperties() {
    return new Promise ((resolve, reject) => {
      const schema = {
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
      };
      resolve (Joi.validate(this.user, schema));
    });
  }

  validateUserProperties() {
    return new Promise ((resolve, reject) => {
      const schema = {
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
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
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        birthyear: Joi.number().integer().min(1900).max(2001).required(),
        email: Joi.string().email({ minDomainSegments: 2 }).required()
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
              // console.log(result.records.length);
              resolve (this.user);
            }
            else {
              // console.log(result.records.length);
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

  getUserInfo(username) {
    return new Promise ((resolve, reject) => {
      let resultPromise = session.run(
        'MATCH (n:User) WHERE n.username=$username RETURN n',
        {username: username}
        );
      resultPromise
        .then(result => {
          if (result.records.length === 1) {
            let user = {username: result.records[0]._fields[0].properties.username, password: result.records[0]._fields[0].properties.password, email: result.records[0]._fields[0].properties.email, birthyear: result.records[0]._fields[0].properties.birthyear};
            resolve(user);
          }
          else reject('User does not exist');
        })
        .catch(err => { console.log(err)});
    });
  }

  changeUserProperies() {
    return new Promise ((resolve, reject) => {
      this.user.password = crypto.createHash('whirlpool').update(this.user.password).digest('hex');
      const newProperties = Object.keys(this.user);
      let changeReq = '{';
      newProperties.forEach((property) => (changeReq = ` ${changeReq}${property} : $${property},`));
      changeReq = `${changeReq}}`;
      changeReq = changeReq.replace(',}', '}');  
      // resolve(changeReq);
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

  deleteRelationships () {
    return new Promise ((resolve, reject) => {
      let resultPromise = session.run(
        'MATCH p=(a)-[r]->(b) WHERE a.username=$username OR b.username=$username DELETE r RETURN r',
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

  addUser() {
    return new Promise ((resolve, reject) => {
      let resultPromise = session.run(
        'CREATE (n:User {username: $username, password: $password, email: $email, birthyear: $birthyear}) RETURN n',
        {username: this.user.username, password: crypto.createHash('whirlpool').update(this.user.password).digest('hex'), email: this.user.email, birthyear: this.user.birthyear}
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

  createUser() {
    return new Promise((resolve, reject) => (
      this.validateNewUser()
        .then(() => this.redundancyCheck())
        .then(() => this.addUser())
        .then((user) => resolve(user))
        .catch((err) => reject(err))
    ));
  }

  updateUser() {
    return new Promise((resolve, reject) => (
      this.validateUserProperties()
      .then(() => this.changeUserProperies())
      .then((user)=> resolve(user))
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
}

module.exports = User;