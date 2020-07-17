/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable camelcase */

const debug = require('debug')('models:users');
const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const UserValidator = require('../validation/users');
const TagValidator = require('../validation/tags');
const userTemplate = require('../util/userTemplate');
const Node = require('./nodeClass');
const Relationship = require('./relationshipsClass');
const driver = require('../util/driver');


class User extends Node {

  constructor(data) {
    const node = {
      label: 'User',
      id: 'username',
      properties: data,
    };
    super({ node_a: node });
    this.data = { node_a: node };
    this.user = this.data.node_a.properties;
    this.allProperties = ['age', 'isTags'];
    this.publicProperties = ['age', 'isTags'];
    this.optionalProperties = ['age'];

    Object.keys(userTemplate).forEach((property) => {
      this.allProperties.push(property);
      if (userTemplate[property].public === true) this.publicProperties.push(property);
      if (userTemplate[property].public === true) this.optionalProperties.push(property);
    });

    this.creationRequirements = {
      username: true,
      firstName: true,
      lastName: true,
      password: true,
      email: true,
      isAdmin: false,
    };
    this.authRequirements = {
      username: true,
      password: true,
    };
    this.updateRequirements = {
      username: true,
    };
    this.deleteRequirements = {
      username: true,
    };
    this.getRequirements = {
      username: true,
    };
    this.tagRequirements = {
      id: true,
    };
    this.relevantProperties = [
      'firsname',
      'age',
      'gender',
      'sexOrient',
      'bio',
      'photos',
      'username',
    ];
    debug('User constructor called');
    this.driver = driver;
  }

  confTokenGenerator() {
    return new Promise((resolve) => {
      if (this.user.username) {
        const data = this.user.username;
        bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(data, salt))
          .then((hash) => {
            this.user.confToken = hash;
            this.data.node_a.properties.confToken = hash;
            resolve(hash);
          })
          .catch(err => debug(err));
      } else resolve();
    });
  }

  resetTokenGenerator() {
    return new Promise((resolve) => {
      if (this.user.username) {
        const data = this.user.username;
        bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(data, salt))
          .then((hash) => {
            this.user.resetToken = hash;
            this.data.node_a.properties.resetToken = hash;
            resolve(hash);
          })
          .catch(err => debug(err));
      } else resolve();
    });
  }

  hashGenerator() {
    debug('hash generator');
    return new Promise((resolve) => {
      if (this.user.password) {
        const data = this.user.password;
        bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(data, salt))
          .then((hash) => {
            this.user.password = hash;
            this.data.node_a.properties.password = hash;
            resolve(hash);
          })
          .catch(err => debug(err));
      } else resolve();
    });
  }

  matchPasswords(user) {
    return new Promise((resolve, reject) => {
      debug(this.user.password, user.password);
      bcrypt.compare(this.user.password, user.password)
        .then((valid) => {
          debug(valid);
          if (valid === true) {
            debug('Verifying password for :', user.username);
            resolve(user);
          } else reject(new Error('bad request'));
        })
        .catch(err => reject(err));
    });
  }

  deleteOrientRelationships() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (n:User { username:'${this.data.node_a.properties.username}'})-[r:IS]->(b:Orientation)
                    DELETE r`;
      session.run(query)
        .then(() => { session.close(); resolve(); })
        .catch(err => reject(err));
    });
  }

  addOrientRelationships() {
    return new Promise((resolve, reject) => {
      if (this.data.node_a.properties.sexOrient && this.data.node_a.properties.gender) {
        const date = new Date();
        let orientation = this.data.node_a.properties.gender === 'male' ? 'm' : 'f';
        orientation = `${orientation}_${this.data.node_a.properties.sexOrient}`;
        const data = {
          node_a: this.data.node_a,
          node_b: {
            label: 'Orientation',
            id: 'id',
            properties: { id: `${orientation}` },
          },
          relation: {
            label: 'IS',
            properties: { creationDate: date.toLocaleString() },
          },
        };
        new Relationship(data).createRelationship()
          .then(() => resolve())
          .catch(err => reject(err));
      } else resolve();
    });
  }

  deleteCompatibilitiesRelationships() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (n:User { username:'${this.data.node_a.properties.username}'})-[r:COMPATIBLE]-(b:User)
                    DELETE r`;
      session.run(query)
        .then(() => { session.close(); resolve(); })
        .catch(err => reject(err));
    });
  }

  addCompatibilities() {
    return new Promise((resolve, reject) => {
      if (this.data.node_a.properties.sexOrient && this.data.node_a.properties.gender) {
        const session = this.driver.session();
        const query = `MATCH z=(a:User { username: '${this.data.node_a.properties.username}'})-[p:IS]->(c:Orientation)-[q:LOOK_FOR]-(d:Orientation)<-[r:IS]-(b:User)
                      WHERE (b.age <= a.ageMax AND b.age >= a.ageMin AND a.age <= b.ageMax AND a.age >= b.ageMin)
                      CREATE (a)-[t:COMPATIBLE]->(b)`;
        session.run(query)
          .then(() => { session.close(); debug(`User compatibilities created for ${this.data.node_a.properties.username}`); resolve(); })
          .catch(err => reject(err));
      } else resolve();
    });
  }

  deleteLookTagsRelationships() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (n:User { username:'${this.data.node_a.properties.username}'})-[r:LOOK_FOR]->(b:Tag)
                    DELETE r`;
      session.run(query)
        .then((res) => { debug(res); session.close(); resolve(); })
        .catch(err => reject(err));
    });
  }

  addLookTagsRelationships() {
    return new Promise((resolve, reject) => {
      const date = new Date();
      debug('Linking User with Tags ...');
      if (this.user.tags) {
        const promises = this.user.tags.map(tag => (
          new Promise((res, rej) => {
            const data = {
              node_a: this.data.node_a,
              node_b: {
                label: 'Tag',
                id: 'id',
                properties: tag,
              },
              relation: {
                label: 'LOOK_FOR',
                properties: { creationDate: date.toLocaleString() },
              },
            };
            new Relationship(data).createRelationship()
              .then(() => res())
              .catch(err => rej(err));
          })
        ));
        Promise.all(promises)
          .then(() => resolve())
          .catch(err => reject(err));
      } else resolve();
    });
  }

  deleteIsTagsRelationships() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (n:User { username:'${this.data.node_a.properties.username}'})-[r:IS]->(b:Tag)
                    DELETE r`;
      session.run(query)
        .then((res) => { debug(res); session.close(); resolve(); })
        .catch(err => reject(err));
    });
  }

  addIsTagsRelationships() {
    return new Promise((resolve, reject) => {
      const date = new Date();
      debug('Linking User with Tags ...');
      if (this.user.isTags) {
        const promises = this.user.isTags.map(tag => (
          new Promise((res, rej) => {
            const data = {
              node_a: this.data.node_a,
              node_b: {
                label: 'Tag',
                id: 'id',
                properties: tag,
              },
              relation: {
                label: 'IS',
                properties: { creationDate: date.toLocaleString() },
              },
            };
            new Relationship(data).createRelationship()
              .then(() => res())
              .catch(err => rej(err));
          })
        ));
        Promise.all(promises)
          .then(() => resolve())
          .catch(err => reject(err));
      } else resolve();
    });
  }

  validateLookTags() {
    return new Promise((resolve, reject) => {
      debug('Validating Tags ...');
      if (this.data.node_a.properties.tags) {
        const promises = this.data.node_a.properties.tags.map(tag => (
          new Promise((res, rej) => {
            new TagValidator(this.tagRequirements, tag).validate()
              .then(() => res())
              .catch(err => rej(err));
          })
        ));
        Promise.all(promises)
          .then(() => resolve())
          .catch(err => reject(err));
      } else resolve();
    });
  }

  validateIsTags() {
    return new Promise((resolve, reject) => {
      debug('Validating Tags ...');
      if (this.data.node_a.properties.isTags) {
        const promises = this.data.node_a.properties.isTags.map(tag => (
          new Promise((res, rej) => {
            new TagValidator(this.tagRequirements, tag).validate()
              .then(() => res())
              .catch(err => rej(err));
          })
        ));
        Promise.all(promises)
          .then(() => resolve())
          .catch(err => reject(err));
      } else resolve();
    });
  }

  generateAuthToken() {
    return new Promise((resolve, reject) => {
      this.getUserInfo()
        .then((infos) => {
          const publicProperties = ['age', 'lastConnection', 'lat', 'lon', 'complete', 'isTags', 'popularity', 'blocked', 'lookTags', 'username', 'firstName', 'lastName', 'birthdate', 'bio', 'gender', 'sexOrient', 'ageMin', 'ageMax', 'active', 'localisation', 'tags', 'forcedLon', 'forcedLat', 'photos'];
          const user = {};
          let tmp = [];
          tmp = publicProperties.map((key) => {
            if (infos[key]) return ({ [key]: infos[key] });
            return ({ [key]: [] });
          });
          tmp.forEach(elem => (Object.assign(user, elem)));
          // debug('debug', user);
          debug('debug', user);

          // debug(_.omit(infos, 'password'));
          // this.token = jwt.sign(user, config.get('jwtPrivateKey'));
          this.token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (3600), // 30s
            data: user,
          }, config.get('jwtPrivateKey'));

          debug('Generating Auth token :', this.token);
          resolve(this.token);
        })
        .catch(err => reject(err));
    });
  }

  getList(value) {
    return new Promise((resolve, reject) => {
      if (this.publicProperties.find(el => (el === value)) !== undefined) {
        this.getNodeList(value)
          .then(list => resolve(list))
          .catch(err => reject(err));
      } else (resolve());
    });
  }

  getProfiles(usersArray) {
    this.profiles = usersArray.map(user => (new User(user).getUserInfo()));
    return Promise.all(this.profiles);
  }

  getLikedBy() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (a:User {username:'${this.user.username}'})<-[r:Notification {type:'like'}]-(b)
                    WITH a, collect(properties(b)) as col
                    RETURN col`;
      session.run(query)
        .then((res) => {
          session.close();
          if (res.records.length !== 0) {
            return this.getProfiles(res.records[0]._fields[0]);
          } return [];
        })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  getLikedTo() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (a:User {username:'${this.user.username}'})-[r:Notification {type:'like'}]->(b)
                    WITH a, collect(properties(b)) as col
                    RETURN col`;
      session.run(query)
        .then((res) => {
          session.close();
          if (res.records.length !== 0) {
            return this.getProfiles(res.records[0]._fields[0]);
          } return [];
        })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  getViewedBy() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (a:User {username:'${this.user.username}'})<-[r:VIEWED]-(b)
                    WITH a, collect(properties(b)) as col
                    RETURN col`;
      session.run(query)
        .then((res) => {
          session.close();
          if (res.records.length !== 0) {
            return this.getProfiles(res.records[0]._fields[0]);
          } return [];
        })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  getMatches() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (a:User {username:'${this.user.username}'})<-[r:Notification {type:'match'}]-(b)
                    OPTIONAL MATCH (a)<-[p:Notification {type:'message', read:'false'}]-(b)
                    WITH b,r, collect({notif:properties(p),id:ID(p)}) as lol
                    RETURN properties(b),lol,r.date`;
      session.run(query)
        .then((res) => {
          session.close();
          if (res.records.length !== 0) {
            // debug('here1', res.records[0]._fields[0]);
            // debug('here1', res.records[0]._fields[1]);
            // debug('here2', res.records[1]._fields[0]);
            // debug('here2', res.records[1]._fields[1]);
            const result = res.records.map((record) => {
              const date = record._fields[2];
              const user = record._fields[0];
              const messages = record._fields[1];
              const unread = record._fields[1].length;
              return { user, unreadMessages: messages, unreadCount: unread, matchCreation: date };
            });
            return result;
          } return [];
        })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  getSuggestions() {
    return new Promise((resolve, reject) => {
      this.getUserInfo()
        .then((currentUser) => {
          this.blocked = currentUser.blocked;
          debug('blocked', this.blocked);
          return (this.getRelations('COMPATIBLE'));
        })
        .then((targets) => {
          this.targets = _.uniq(targets);
          this.blocked.forEach((blocked) => {
            this.targets = _.remove(this.targets, target => (target.username !== blocked.username));
          });
          // debug('targets', this.targets);
          this.promises = this.targets.map(user => (new User(user).getUserInfo()));
          return Promise.all(this.promises);
        })
        .then((targets) => { this.targets = targets.map(user => (_.omit(user, 'blocked', 'password', 'email', 'isAdmin', 'active'))); return (this.getLikedBy()); })
        .then((likedBys) => {
          this.targets.forEach((user) => {
            // eslint-disable-next-line no-unneeded-ternary
            Object.assign(user, { likedU: likedBys.find(el => (user.username === el.username)) === undefined ? false : true });
          });
          return (this.getLikedTo());
        })
        .then((likedTos) => {
          this.targets.forEach((user) => {
            // eslint-disable-next-line no-unneeded-ternary
            Object.assign(user, { Uliked: likedTos.find(el => (user.username === el.username)) === undefined ? false : true });
          });
          return (this.getCommonTags());
        })
        .then((common) => { this.common = common; return (this.getReverseCommonTags()); })
        .then((reverseCommon) => {
          this.reverseCommon = reverseCommon;
          this.maxcomp = 0;
          // debug('target before sort', this.targets)
          this.list = this.targets.map((target) => {
            if (this.common.find(el => (target.username === el.user.username)) === undefined
              && this.reverseCommon.find(el => (target.username === el.user.username)) === undefined) {
              return ({ user: target, compTags: [], reverseCompTags: [] });
            } if (this.common.find(el => (target.username === el.user.username)) === undefined) {
              // eslint-disable-next-line prefer-destructuring
              const reverseCompTags = this.reverseCommon.find(el => (target.username === el.user.username)).reverseCompTags;
              return ({ user: target, compTags: [], reverseCompTags });
            } if (this.reverseCommon.find(el => (target.username === el.user.username)) === undefined) {
              // eslint-disable-next-line prefer-destructuring
              const compTags = this.common.find(el => (target.username === el.user.username)).compTags;
              const l = compTags.length;
              if (this.maxcomp <= l) { this.maxcomp = l; }
              return ({ user: target, compTags, reverseCompTags: [] });
            } 
            // eslint-disable-next-line prefer-destructuring
            const compTags = this.common.find(el => (target.username === el.user.username)).compTags;
            // eslint-disable-next-line prefer-destructuring
            const reverseCompTags = this.reverseCommon.find(el => (target.username === el.user.username)).reverseCompTags;
            const l = compTags.length;
            if (this.maxcomp <= l) { this.maxcomp = l; }
            return ({ user: target, compTags, reverseCompTags });
          });
          // debug('list', this.list);
          this.result = [];
          for (let i = this.maxcomp; i >= 0; i -= 1) {
            this.list.forEach((element) => {
              if (element.compTags.length === i) this.result.push(element);
            });
          }
          resolve(this.result);
        })
        .catch(err => reject(err));
    });
  }

  getCommonTags() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (a:User { username: '${this.data.node_a.properties.username}'})-[r:LOOK_FOR]->(c:Tag)<-[l:IS]-(b:User),(a)-[m:COMPATIBLE]-(b)
                    WITH a,b, collect(properties(c)) as common
                    RETURN properties(b),common`;
      session.run(query)
        .then((res) => {
          session.close();
          this.result = [];
          if (res.records.length !== 0) {
            res.records.forEach((record) => {
              this.result.push({ user: _.pick(record._fields[0], this.relevantProperties), compTags: _.uniqBy(record._fields[1], 'id') });
            });
          }
          resolve(this.result);
        })
        .catch(err => reject(err));
    });
  }

  getReverseCommonTags() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (a:User { username: '${this.data.node_a.properties.username}'})-[r:IS]->(c:Tag)<-[l:LOOK_FOR]-(b:User),(a)-[m:COMPATIBLE]-(b)
                    WITH a,b, collect(properties(c)) as common
                    RETURN properties(b),common`;
      session.run(query)
        .then((res) => {
          session.close();
          this.result = [];
          if (res.records.length !== 0) {
            res.records.forEach((record) => {
              this.result.push({ user: _.pick(record._fields[0], this.relevantProperties), reverseCompTags: _.uniqBy(record._fields[1], 'id') });
            });
          }
          resolve(this.result);
        })
        .catch(err => reject(err));
    });
  }

  calcAge() {
    return new Promise((resolve, reject) => {
      if (this.data.node_a.properties.birthdate) {
        const getAge = birthDate => Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10);
        const age = getAge(this.data.node_a.properties.birthdate);
        this.data.node_a.properties.age = age;
        resolve();
      } resolve();
    });
  }

  getBlocked() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (n:User {username:'${this.user.username}'})-[r:BLOCK]->(b:User)
                    WITH n, collect(properties(b)) as col
                    RETURN col`;
      session.run(query)
        .then((res) => {
          if (res.records.length !== 0) resolve(res.records[0]._fields[0]);
          resolve([]);
        })
        .catch(err => debug(err));
    });

  }

  getRelations(relation) {
    return new Promise((resolve, reject) => {
      this.data.relation = {
        label: relation,
      };
      this.getNodetypeofRelationships()
        .then(list => resolve(list))
        .catch(err => reject(err));
    });
  }

  getUserIsTags(username) {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (a:User {username:'${username}'})-[r:IS]->(b:Tag)
                    WITH a, collect(properties(b)) as tags
                    RETURN tags`;
      session.run(query)
        .then((res) => {
          session.close();
          if (res.records.length !== 0) {
            resolve(res.records[0]._fields[0]);
          } resolve();
        })
        .catch(err => reject(err));
    });
  }

  getUserLookTags(username) {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (a:User {username:'${username}'})-[r:LOOK_FOR]->(b:Tag)
                    WITH a, collect(properties(b)) as tags
                    RETURN tags`;
      session.run(query)
        .then((res) => {
          session.close();
          if (res.records.length !== 0) {
            resolve(res.records[0]._fields[0]);
          } resolve();
        })
        .catch(err => reject(err));
    });
  }

  getUserInfo() {
    return new Promise((resolve, reject) => {
      debug('Getting user info for :', this.user.username);
      new UserValidator(this.getRequirements, this.data.node_a.properties).validate()
        .then(() => this.getNodeInfo())
        .then((user) => { this.result = user; return (this.getUserIsTags(this.data.node_a.properties.username)); })
        .then((isTags) => { if (isTags) { this.result.isTags = isTags; } else this.result.isTags = []; return (this.getUserLookTags(this.data.node_a.properties.username)); })
        .then((lookTags) => { if (lookTags) { this.result.lookTags = lookTags; } else this.result.lookTags = []; return (this.getBlocked()); })
        .then((blocked) => { this.result.blocked = blocked; resolve(this.result); })
        .catch(err => reject(err));
    });
  }

  createUser() {
    return new Promise((resolve, reject) => (
      new UserValidator(this.creationRequirements, this.user).validate()
        .then(() => this.redundancyCheck())
        .then(() => this.hashGenerator())
        .then(() => this.calcAge())
        .then(() => {
          this.data.node_a.properties.popularity = '0';
          if (this.data.node_a.properties && !this.data.node_a.properties.sexOrient) {
            this.data.node_a.properties.sexOrient = 'bi';
          }
          if (this.data.node_a.properties && !this.data.node_a.properties.localisation) {
            this.data.node_a.properties.localisation = 42;
          }
          if (this.data.node_a.properties && !this.data.node_a.properties.ageMin) {
            this.data.node_a.properties.ageMin = 42;
          }
          if (this.data.node_a.properties && !this.data.node_a.properties.ageMax) {
            this.data.node_a.properties.ageMax = 84;
          }
          // if (this.data.node_a.properties && !this.data.node_a.properties.lat) {
          //   this.data.node_a.properties.lat = 48.896704899999996;
          // }
          // if (this.data.node_a.properties && !this.data.node_a.properties.lon) {
          //   this.data.node_a.properties.lon = 1.3184218;
          // }
          if (this.data.node_a.properties && !this.data.node_a.properties.active) {
            this.data.node_a.properties.active = 'false';
          }
          if (this.data.node_a.properties && this.data.node_a.properties.complete === undefined) {
            if (this.data.node_a.properties.sexOrient && this.data.node_a.properties.age && this.data.node_a.properties.gender && this.data.node_a.properties.photos && this.data.node_a.properties.photos[0]) {
              this.data.node_a.properties.complete = 'true';
            } else this.data.node_a.properties.complete = 'false';
          }
          if (this.data.node_a.properties.active === 'false') {
            return this.sendConfLink();
          } return new Promise(res => res());
        })
        .then(() => this.createNode())
        .then(() => this.validateLookTags())
        .then(() => this.addLookTagsRelationships())
        .then(() => this.validateIsTags())
        .then(() => this.addIsTagsRelationships())
        .then(() => this.addOrientRelationships())
        .then(() => this.addCompatibilities())
        .then(() => resolve(_.pick(this.user,
          this.publicProperties.concat(this.optionalProperties))))
        .catch((err) => { debug(err); resolve(err); })
    ));
  }

  updateUser(newData) {
    debug(newData);
    return new Promise((resolve, reject) => (
      new UserValidator(this.updateRequirements, this.user).validate()
        .then(() => {
          if (newData.password) {
            this.user.password = newData.password;
            return this.hashGenerator();
          } return new Promise(res => (res()));
        })
        .then((pass) => {
          this.newData = newData;
          debug('newData:', this.newData);
          if (pass) {
            this.newData.password = pass;
          }
          if (newData.birthdate) {
            this.data.node_a.properties.birthdate = newData.birthdate;
            return this.calcAge()
              .then(() => {
                newData.age = this.data.node_a.properties.age;
                return this.updateNode(this.newData);
              })
          } else return this.updateNode(this.newData);
        })
        .then((user) => {
          this.user = user;
          if (newData.tags) {
            debug('new looktags detected');
            this.user.tags = newData.tags;
            const node = {
              label: 'User',
              id: 'username',
              properties: this.user,
            };
            this.data = { node_a: node };
            return (this.deleteLookTagsRelationships()
              .then(() => this.addLookTagsRelationships()));
          } return (new Promise(res => res()));
        })
        .then(() => {
          if (newData.isTags) {
            debug('new isTags detected');
            this.user.isTags = newData.isTags;
            const node = {
              label: 'User',
              id: 'username',
              properties: this.user,
            };
            this.data = { node_a: node };
            return (this.deleteIsTagsRelationships()
              .then(() => this.addIsTagsRelationships()));
          } return (new Promise(res => res()));
        })
        .then(() => {
          if (newData.sexOrient || (this.user.sexOrient && newData.gender)) {
            if (newData.sexOrient) { this.user.sexOrient = newData.sexOrient; }
            if (newData.gender) { this.user.gender = newData.gender; }
            const node = {
              label: 'User',
              id: 'username',
              properties: this.user,
            };
            this.data = { node_a: node };
            return (this.deleteOrientRelationships()
              .then(() => this.addOrientRelationships()));
          } return (new Promise(res => res()));
        })
        .then(() => { this.data.node_a.properties = this.user; debug('deleting compatibilities'); return this.deleteCompatibilitiesRelationships(); })
        .then(() => { debug('creating compatibilities'); return this.addCompatibilities(); })
        .then(() => {
          this.updatedUser = this.user;
          debug(this.updatedUser);
          if (this.updatedUser.sexOrient && this.updatedUser.age && this.updatedUser.gender && this.updatedUser.photos && this.updatedUser.photos[0]) {
            const session = this.driver.session();
            const query = `MATCH (n:User {username:'${this.updatedUser.username}'})
                          SET n.complete = 'true'`;
            return session.run(query)
              .then(() => (session.close()));
          } return new Promise(res => (res()));
        })
        .then(() => new User(this.user).generateAuthToken())
        .then((token) => { this.updatedUser.token = token; resolve(_.omit(this.updatedUser, 'password')); })
        .catch(err => reject(err))
    ));
  }

  deleteUser() {
    return new Promise((resolve, reject) => (
      new UserValidator(this.deleteRequirements, this.user).validate()
        .then(() => this.deleteThisNodeRelationships())
        .then(() => this.deleteNode())
        .then(user => resolve(user))
        .catch(err => reject(err))
    ));
  }

  authenticateUser() {
    return new Promise((resolve, reject) => (
      new UserValidator(this.authRequirements, this.user).validate()
        .then(() => this.getUserInfo())
        .then(existingUser => this.matchPasswords(existingUser))
        .then((existingUser) => {
          this.active = existingUser.active;
          return this.generateAuthToken(existingUser);
        })
        .then((token) => {
          debug(this.active);
          if (this.active === 'true') resolve(token);
          else {
            resolve('Please Confirm your email.');
          }
        })
        .catch(err => reject(err))
    ));
  }

  deleteUsersDuplicates() {
    return new Promise((resolve, reject) => {
      this.data = {
        node_a: {
          label: 'User',
          id: 'username',
        },
      };
      this.deleteNodeDuplicates()
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  createResetToken() {
    debug('Reset Token generator');
    return new Promise((resolve) => {
      bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(this.user.username, salt))
        .then(hash => resolve(hash))
        .catch(err => debug(err));
    });
  }

  sendResetLink() {
    return new Promise((resolve, reject) => {
      this.createResetToken()
        .then((token) => {
          const newData = { resetToken: token };
          this.resetToken = token;
          return this.updateUser(newData);
        })
        .then(() => this.sendResetMail(this.resetToken))
        .then(() => resolve(true))
        .catch(err => reject(err));
    });
  }

  sendResetMail(oldtoken) {
    return new Promise((resolve, reject) => {
      debug('SENDING RESET MAIL');

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'cajulien.42.matcha@gmail.com',
          pass: 'Ff7midgar6',
        },
      });
      const token = oldtoken.replace(/\//gi, '_');
      debug(token);
      transporter.sendMail({
        from: 'cajulien.42.matcha@gmail.com',
        to: ['kamillejulien@gmail.com', 'psentilh@student.42.fr', this.user.email],
        subject: 'Change password for Matcha',
        text: 'Hi',
        html: `Hi ${this.user.username}, to change your password for Matcha, please click on <a href='http://localhost:3000/reset_password/${this.user.username}/${token}'>this link</a>`,
      }).then(() => resolve())
        .catch(err => reject(err));
    });
  }

  matchResetTokens(token) {
    return new Promise((resolve, reject) => {
      this.getUserInfo()
        .then((user) => {
          const decodedToken = token.replace(/_/gi, '/');
          // decodedToken = token.replace(/\\/gi, '/');
          debug(user.resetToken, decodedToken);
          if (user.resetToken === decodedToken) resolve(true);
          else reject(new Error('wrong token'));
        })
        .catch(err => reject(err));
    });
  }

  eraseResetToken() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (n:User {username:'${this.user.username}'})
                      REMOVE n.resetToken
                      RETURN n`;
      session.run(query)
        .then(() => { session.close(); resolve(); })
        .catch(err => debug(err));
    });
  }

  resetPwd(token) {
    return new Promise((resolve, reject) => {
      this.matchResetTokens(token)
        .then((result) => {
          if (result === true) return this.eraseResetToken();
          reject();
        })
        .then(() => this.generateAuthToken())
        .then(auth => resolve(auth))
        .catch(err => reject(err));
    });
  }

  createConfToken() {
    debug('Conf Token generator');
    return new Promise((resolve) => {
      bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(this.user.username, salt))
        .then(hash => resolve(hash))
        .catch(err => debug(err));
    });
  }

  sendConfLink() {
    return new Promise((resolve, reject) => {
      this.createConfToken()
        .then((token) => {
          this.data.node_a.properties.confToken = token;
          this.sendConfMail(token);
        })
        .then(() => resolve(true))
        .catch(err => reject(err));
    });
  }

  sendConfMail(oldtoken) {
    return new Promise((resolve, reject) => {
      debug('SENDING Conf MAIL');

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'cajulien.42.matcha@gmail.com',
          pass: 'Ff7midgar6',
        },
      });
      const token = oldtoken.replace(/\//gi, '_');
      debug(token);
      transporter.sendMail({
        from: 'cajulien.42.matcha@gmail.com',
        to: ['kamillejulien@gmail.com', 'philousentilhes@gmail.com', this.user.email],
        subject: 'Email confirmation for Matcha',
        text: 'Hi',
        html: `Hi ${this.user.username}, to complete your registration to Matcha, please click on <a href='http://localhost:3000/confirm/${this.user.username}/${token}'>this link</a>`,
      }).then(() => resolve())
        .catch(err => reject(err));
    });
  }

  sendReport() {
    this.getUserInfo()
      .then((user) => {
        return new Promise((resolve, reject) => {
          debug('SENDING Report MAIL');
    
          const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: 'cajulien.42.matcha@gmail.com',
              pass: 'Ff7midgar6',
            },
          });

          transporter.sendMail({
            from: 'cajulien.42.matcha@gmail.com',
            to: ['kamillejulien@gmail.com', 'philousentilhes@gmail.com', user.email],
            subject: 'Report from Matcha',
            text: 'Hi',
            html: `Hi ${user.username}, you have been reported and are now under investigation`,
          }).then(() => resolve())
            .catch(err => reject(err));
        });
      })
      .catch(err => debug(err));
  }

  matchConfTokens(token) {
    return new Promise((resolve, reject) => {
      this.getUserInfo()
        .then((user) => {
          debug('HERE', user);
          const decodedToken = token.replace(/_/gi, '/');
          debug(user.confToken, decodedToken);
          if (user.confToken === decodedToken) resolve(true);
          else reject(new Error('wrong token'));
        })
        .catch(err => reject(err));
    });
  }

  eraseConfToken() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (n:User {username:'${this.user.username}'})
                      SET n.active='true'
                      REMOVE n.confToken
                      RETURN n`;
      session.run(query)
        .then(() => { session.close(); resolve(); })
        .catch(err => debug(err));
    });
  }

  confirmUser(token) {
    return new Promise((resolve, reject) => {
      this.matchConfTokens(token)
        .then((result) => {
          if (result === true) return this.eraseConfToken();
          reject();
        })
        .then(user => resolve(true))
        .catch(err => reject(err));
    });
  }

  visits(target) {
    return new Promise((resolve, reject) => {
      const date = new Date().toLocaleString();
      const session = this.driver.session();
      const query1 = `MATCH (n:User { username:'${this.user.username}'})-[r:VISITED]->(b:User {username:'${target}'})
                      DELETE r`;
      const query2 = `MATCH (n:User { username:'${this.user.username}'}),(b:User {username:'${target}'})
                      CREATE (n)-[r:VISITED {lastVisit:'${date}'}]->(b)`;
      session.run(query1)
        .then(() => session.run(query2))
        .then(() => { session.close(); new User({ username: target }).updateScore(); })
        .then(() => { resolve(true); })
        .catch(err => debug(err));
    });
  }

  getVisits() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (n:User { username:'${this.user.username}'})<-[r:Notification {type:'visit'}]-(b:User)
                    RETURN properties(b),r.date`;
      session.run(query)
        .then((res) => {
          const result = [];
          if (res.records.length !== 0) {
            res.records.forEach((record) => {
              result.push({ user: record._fields[0], date: record._fields[1] });
            });
          } resolve(result);
        })
        .catch(err => debug(err));
    });
  }

  getLikes() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (n:User { username:'${this.user.username}'})<-[r:Notification {type:'like'}]-(b:User)
                    RETURN properties(b),r.date`;
      session.run(query)
        .then((res) => {
          const result = [];
          if (res.records.length !== 0) {
            res.records.forEach((record) => {
              result.push({ user: record._fields[0], date: record._fields[1] });
            });
          } resolve(result);
        })
        .catch(err => debug(err));
    });
  }

  getConversations() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (n:User { username:'${this.user.username}'})-[r:Notification {type:'message'}]-(b:User)
                    WITH b,r ORDER BY r.time DESC 
                    WITH b, collect(properties(r)) as conv
                    return b.username,head(conv)`;
      session.run(query)
        .then((res) => {
          const result = [];
          debug(res);
          if (res.records.length !== 0) {
            res.records.forEach((record) => {
              result.push({
                username: record._fields[0],
                lastMessage: record._fields[1],
              });
            });
          } resolve(result);
        });
    });
  }

  getConversationWith(target) {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (n:User { username:'${this.user.username}'})-[r:Notification {type:'message'}]-(b:User {username:'${target}'})
                    WITH b,r ORDER BY r.time ASC
                    WITH b, collect({notif:properties(r),id:ID(r)}) as conv
                    return b.username,conv`;
      session.run(query)
        .then((res) => {
          const result = [];
          debug(res);
          if (res.records.length !== 0) {
            res.records.forEach((record) => {
              result.push({
                username: record._fields[0],
                conversation: record._fields[1],
              });
            });
          } resolve(result);
        });
    });
  }

  updateScore() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (n:User { username:'${this.user.username}'})<-[r:Notification {type:'like'}]-(b:User)
                    RETURN count(r)`;
      const query2 = `MATCH (n:User { username:'${this.user.username}'})<-[r:Notification {type:'visit'}]-(b:User)
                    RETURN count(r)`;
      const query3 = `MATCH (n:User { username:'${this.user.username}'})<-[r:CONVERSATION]-(b:User)
                    RETURN count(r)`;
      const query4 = `MATCH (n:User { username:'${this.user.username}'})-[r:Notification {type:'match'}]->(b:User)
                    RETURN count(r)`;
      const query5 = `MATCH (n:User { username:'${this.user.username}'})<-[r:BLOCK]-(b:User)
                    RETURN count(r)`;
      this.getUserInfo()
        .then((res) => {
          this.data.node_a.properties = _.pick(res, this.rele);
          return (session.run(query));
        })
        .then((res) => {
          this.liked = res.records[0]._fields[0];
          return session.run(query2);
        })
        .then((res) => {
          this.visits = res.records[0]._fields[0];
          return session.run(query3);
        })
        .then((res) => {
          this.conversations = res.records[0]._fields[0];
          return session.run(query4);
        })
        .then((res) => {
          this.matches = res.records[0]._fields[0];
          return session.run(query5);
        })
        .then((res) => {
          this.blocks = res.records[0]._fields[0];
          this.popularity = 1 * this.visits
                          + 2 * this.liked
                          + 3 * this.matches
                          + 4 * this.conversations
                          - 10 * this.blocks;
          if (this.popularity < 0) this.popularity = 0;
          if (this.popularity > 100) this.popularity = 100;
          const query6 = `MATCH (n:User {username:'${this.user.username}'})
          SET n.popularity = '${this.popularity}'`;
          return (session.run(query6));
        })
        .then(() => {
          session.close();
          return this.deleteCompatibilitiesRelationships();
        })
        .then(() => this.addCompatibilities())
        .then(() => { debug('popularity and compatibilities updated'); resolve({ newPopularity: this.popularity }); })
        .catch(err => debug(err));
    });
  }

  connect() {
    return new Promise((resolve, reject) => {
      const date = new Date().toLocaleString();
      const session = this.driver.session();
      const query = `MATCH (a:User { username:'${this.user.username}'})
                    SET a.lastConnection='${date}'`;
      session.run(query)
        .then(() => resolve(`User connected on ${date}`))
        .catch(err => debug(err));
    });
  }

  toggleLike(target) {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query1 = `MATCH p=(a:User { username:'${this.user.username}'})-[r:Notification {type:'like'}]->(b:User {username:'${target}'}) return p`;
      const query2 = `MATCH p=(a:User { username:'${this.user.username}'})<-[r:Notification {type:'like'}]-(b:User {username:'${target}'}) return p`;
      session.run(query1)
        .then((res) => {
          session.close();
          res.records[0] ? this.prev = 1 : this.prev = 0;
          return session.run(query2);
        })
        .then((res) => {
          session.close();
          res.records[0] ? this.next = 1 : this.next = 0;
          this.case = [this.prev, this.next];
          debug(this.case);
          let toEmit = [];
          if (this.case[0] === 0 && this.case[1] === 0) {
            toEmit = [
              {
                emitter: this.user.username,
                receiver: target,
                type: 'like',
              },
            ];
          }
          if (this.case[0] === 0 && this.case[1] === 1) {
            toEmit = [
              {
                emitter: this.user.username,
                receiver: target,
                type: 'match',
              },
              {
                emitter: target,
                receiver: this.user.username,
                type: 'match',
              },
              {
                emitter: this.user.username,
                receiver: target,
                type: 'like',
              },
            ];
          }
          if (this.case[0] === 1 && this.case[1] === 0) {
            toEmit = [
              {
                emitter: this.user.username,
                receiver: target,
                type: 'unlike',
              },
            ];
          }
          if (this.case[0] === 1 && this.case[1] === 1) {
            toEmit = [
              {
                emitter: this.user.username,
                receiver: target,
                type: 'unmatch',
              },
              {
                emitter: target,
                receiver: this.user.username,
                type: 'unmatch',
              },
              {
                emitter: this.user.username,
                receiver: target,
                type: 'unlike',
              },
            ];
          } resolve(toEmit);
        })
        .catch(err => debug(err));
    });
  }

  report(target) {
    return new Promise((resolve, reject) => {
      const date = new Date().toLocaleString();
      const session = this.driver.session();
      const query0 = `MATCH (n:User { username:'${this.user.username}'})-[r:REPORTED]->(b:User {username:'${target}'})
                      RETURN properties(r)`;
      const query1 = `MATCH (n:User { username:'${this.user.username}'})-[r:REPORTED]->(b:User {username:'${target}'})
                      DELETE r`;
      const query2 = `MATCH (n:User { username:'${this.user.username}'}),(b:User {username:'${target}'})
                      CREATE (n)-[r:REPORTED {date:'${date}'}]->(b)`;
      session.run(query0)
        .then((res) => {
          session.close();
          if (!res.records[0]) { new User({ username: target }).sendReport(); }
          return session.run(query1);
        })
        .then(() => { session.close(); return session.run(query2); })
        .then(() => { session.close(); resolve(true); })
        .catch(err => debug(err));
    });
  }

}

module.exports = User;
