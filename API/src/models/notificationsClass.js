/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable camelcase */

const debug = require('debug')('models:notifs');
const _ = require('lodash');
const driver = require('../util/driver');
const User = require('./userClass');

class Notifications {

  constructor(data) {
    this.data = data;
    if (data.emitter) this.emitter = data.emitter;
    if (data.receiver) this.receiver = data.receiver;
    if (data.type) this.type = data.type;
    if (data.message) this.message = data.message;
    if (data.id) this.id = data.id;
    this.driver = driver;
    // debug('Notif constructor called', this.data);
  }

  create() {
    return new Promise((resolve, reject) => {
      if (!this.emitter || !this.receiver || !this.type) resolve('Missing information');
      const date = new Date().toLocaleString();
      const time = new Date().getTime();
      const session = this.driver.session();
      if (this.type === 'visit') this.previous = 'visit';
      if (this.type === 'like') this.previous = 'unlike';
      if (this.type === 'match') this.previous = 'unmatch';
      if (this.type === 'unlike') this.previous = 'like';
      if (this.type === 'unmatch') this.previous = 'match';
      if (this.type === 'message') {
        this.previous = 'message';
        debug(this.message.length);
        if (!this.message || this.message === '' || (this.message && this.message.length > 255)) { debug('HA'); resolve('no message'); }
        else {
          const query = `MATCH (a:User {username:'${this.emitter}'}),(b:User {username:'${this.receiver}'})
                      CREATE (a)-[r:Notification $props]->(b)`;
          const props = {
            type: this.type,
            date,
            time,
            message: this.message,
            emitter: this.emitter,
            receiver: this.receiver,
            read: 'false',
          };
          session.run(query, { props })
            .then((res) => {
              // debug('Notification created:', this.data);
              session.close();
              new User({ username: this.receiver }).updateScore();
              resolve(true);
            })
            .catch(err => debug(err));
        }
      } else {
        const query0 = `MATCH (a:User {username:'${this.emitter}'})-[r:Notification {type:'${this.previous}'}]->(b:User {username:'${this.receiver}'})
                      DELETE r`;
        const query = `MATCH (a:User {username:'${this.emitter}'}),(b:User {username:'${this.receiver}'})
                      CREATE (a)-[r:Notification {type:'${this.type}', date:'${date}', read:'false'}]->(b)`;
        session.run(query0)
          .then(() => session.run(query))
          .then((res) => {
            // debug('Notification created:', this.data);
            session.close();
            new User({ username: this.receiver }).updateScore();
            resolve(true);
          })
          .catch(err => debug(err));
      }
    });
  }

  get() {
    return new Promise((resolve, reject) => {
      if (!this.receiver) resolve('No receiver Provided!');
      const session = this.driver.session();
      const query = `MATCH (a:User {username:'${this.receiver}'})<-[r:Notification]-(c:User)
                    RETURN r.type,r.read,properties(c),ID(r)
                    ORDER BY r.date DESC`;
      session.run(query)
        .then((res) => {
          session.close();
          const result = [];
          new User({ username: this.receiver }).getBlocked()
            .then((blocked) => {
              debug('blocked: ', blocked);
              if (res.records.length !== 0) {
                res.records.forEach((record) => {
                  debug(record._fields[2].username);
                  if (_.findKey(blocked, elem => (elem.username === record._fields[2].username)) === undefined) {
                    result.push({
                      type: record._fields[0],
                      emitter: _.omit(record._fields[2], ['password', 'email']),
                      read: record._fields[1],
                      id: record._fields[3],
                    });
                  }
                });
              } resolve(result);
            })
            .catch(err => debug(err));
        })
        .catch(err => debug(err));
    });
  }

  read() {
    return new Promise((resolve, reject) => {
      if (!this.id || !this.receiver) resolve('Bad input');
      const date = new Date().toLocaleString();
      const session = this.driver.session();
      const query = `MATCH (n:User {username:'${this.receiver}'})<-[r:Notification]-(b)
                    WHERE ID(r) = ${this.id}
                    SET r.read='${date}'`;
      session.run(query)
        .then(() => resolve('notification has been read'))
        .catch(err => debug(err));
    });
  }
}

module.exports = Notifications;
