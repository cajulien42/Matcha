const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
const session = driver.session();
const Joi = require('@hapi/joi');
const crypto = require('crypto');

class User {
  constructor(){
  }
  
  redundancyCheck(user) {
    return new Promise ((resolve, reject) => {
      let resultPromise = session.run(
        'MATCH (n:User) WHERE n.username=$username OR n.email=$email RETURN n',
        {username: user.username, email: user.email}
        );
        resultPromise
          .then(result => {
            if (result.records.length === 0) {
              // console.log(result.records.length);
              resolve (user);
            }
            else {
              // console.log(result.records.length);
              reject(new Error('User exists'));
            }
          })
          .catch(err => {console.log(err)})
    });
  }

  addUser(user) {
    return new Promise ((resolve, reject) => {
      let resultPromise = session.run(
        'CREATE (n:User {username: $username, password: $password, email: $email, birthyear: $birthyear}) RETURN n',
        {username: user.username, password: crypto.createHash('whirlpool').update('nodejsera', 'utf-8').digest(user.password), email: user.email, birthyear: user.birthyear}
      );
      resultPromise.then(result => {
        session.close();
      
        const singleRecord = result.records[0];
        const node = singleRecord.get(0);
        resolve(node.properties);
      });
    });
  }

  create(user) {
    return new Promise((resolve, reject) => (
      this.redundancyCheck(user)
        .then(() => this.addUser(user))
        .then(user => resolve(user))
        .catch(err => reject(err))
    ));
  }
}

module.exports = User;