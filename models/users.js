const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
const session = driver.session();
const Joi = require('@hapi/joi');
const crypto = require('crypto');

class User {
  constructor(user){
    this.user = user;
  }
  
  
  validateUserProperties() {
    return new Promise ((resolve, reject) => {
      const schema = {
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
        birthyear: Joi.number().integer().min(1900).max(2001),
        email: Joi.string().email({ minDomainSegments: 2 }),
        supertest: Joi.string().alphanum().min(3).max(30)
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

  changeUserProperies() {
    return new Promise ((resolve, reject) => {
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
}

module.exports = User;