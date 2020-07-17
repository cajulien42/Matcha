
const debug = require('debug')('init:notifications');
const Notifications = require('../models/notificationsClass');
const User = require('../models/userClass');
const Tag = require('../models/tagClass');

const date = new Date();
const chaosCounter = 2;

function rand(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function randomNotifications() {
  const users = await new User().getList('username');
  return new Promise((resolve, reject) => {
    const notifications = [];
    const promises = users.map(user => (
      new Promise((res) => {
        for (let i = 0; i < chaosCounter; i += 1) {
          const target = users[rand(0, users.length - 1)];
          if (target !== user && user !== 'camille' && user !== 'philoutre' && user !== 'amandine28') {
            notifications.push(
              {
                type: 'like',
                emitter: user,
                receiver: target,
              },
            );
          }
          res();
        }
      })
    ));

    Promise.all(promises)
      .then(() => resolve(notifications))
      .catch(err => reject(err));
  });
}

function populatenotifications() {
  return (randomNotifications()
    .then((notifications) => {
      notifications.push({
        type: 'like',
        emitter: 'camille',
        receiver: 'philoutre',
      });
      notifications.push({
        type: 'like',
        emitter: 'philoutre',
        receiver: 'camille',
      });
      notifications.push({
        type: 'match',
        emitter: 'camille',
        receiver: 'philoutre',
      });
      notifications.push({
        type: 'match',
        emitter: 'philoutre',
        receiver: 'camille',
      });
      return (notifications.reduce(async (prev, next) => {
        await prev;
        return new Notifications(next).create();
      }, Promise.resolve()));
    }));
}

module.exports = populatenotifications;
