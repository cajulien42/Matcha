const debug = require('debug')('app:debug');
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
const session = driver.session();
const bcrypt = require('bcrypt');
const Validator = require('./validator');

class User {

  constructor(user){
    if (user && user.username) this.user = user;
    else if (user) { 
      this.user = {};
      this.user.username = user;
    }
    this.publicProperties = ['username', 'email', 'birthyear'];
    this.optionalProperties = ['optional'];
    this.creationRequirements = {required : ['username', 'password' , 'email', 'birthyear'], optional: ['optional']};
    this.authRequirements = {required : ['username', 'password']};
    this.updateRequirements = {required : ['username'],  optional : ['password' , 'email', 'birthyear', 'optional']};
    this.deleteRequirements = {required : ['username']};
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
          .catch(err => {debug(err)})
    });
  }

  hashGenerator() {
    return new Promise((resolve) => {
    if (this.user.password) {
    bcrypt.genSalt(10)
      .then((salt) => bcrypt.hash(this.user.password, salt))
      .then(hash => resolve(hash))
      .catch(err => debug(err));
    }
    else resolve(null);
    });
  }

  matchPasswords(user) {
    return new Promise((resolve, reject) => {
      debug(this.user.password, user.password);
      bcrypt.compare(this.user.password, user.password)
        .then((valid) => {
          if (valid === true) {
            resolve(user);
          }
          else reject('bad request');
        })
        .catch(err => reject(err));
    })
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
        .catch(err => { debug(err)});
    });
  }

  getUserInfo() {
    return new Promise ((resolve, reject) => {
      debug(this.user);
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
        .catch(err => { debug(err)});
    });
  }

  deleteRelationships () {
    return new Promise ((resolve) => {
      let resultPromise = session.run(
        'MATCH p=(a)-[r]->(b) WHERE a.username=$username OR b.username=$username DELETE r',
        {username: this.user.username}
      );
      resultPromise.then(() => {
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

  changeUserProperies(hash) {
    return new Promise ((resolve, reject) => {
      if (hash) this.user.password =  hash;
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

  addUser(hash) {
    return new Promise ((resolve, reject) => {
      this.user.password =  hash;
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

  createUser() {
    return new Promise((resolve, reject) => (
      new Validator(this.creationRequirements, this.user).validate()
        .then(() => this.redundancyCheck())
        .then(() => this.hashGenerator())
        .then((hash) => this.addUser(hash))
        .then((user) => resolve(_.pick(user, this.publicProperties.concat(this.optionalProperties))))
        .catch((err) => reject(err))
    ));
  }

  updateUser() {
    return new Promise((resolve, reject) => (
      new Validator(this.updateRequirements, this.user).validate()
      .then(() => this.hashGenerator())
      .then((hash) => this.changeUserProperies(hash))
      .then((user)=> resolve(_.pick(user, this.publicProperties.concat(this.optionalProperties))))
      .catch(err => reject(err))
    ));
  }

  deleteUser() {
    return new Promise((resolve, reject) => (
      new Validator(this.deleteRequirements, this.user).validate()
      .then(() => this.deleteRelationships())
      .then(() => this.deleteNode())
      .then((user) => resolve(user))
      .catch(err => reject(err))
    ));
  }

  authenticateUser() {
    return new Promise((resolve, reject) => (
      new Validator(this.authRequirements, this.user).validate()
        .then(() => this.getUserInfo())
        .then((existingUser) => this.matchPasswords(existingUser))
        .then((existingUser) => resolve(existingUser))
        .catch(err => reject(err))
    ));
  }
}

module.exports = User;