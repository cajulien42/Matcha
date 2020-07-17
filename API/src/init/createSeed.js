

const debug = require('debug')('init:users');
const _ = require('lodash');
const axios = require('axios');
const fs = require('fs');

const User = require('../models/userClass');

const props = ['gender', 'email', 'password'];
const requiredProperties = ['username', 'firstName', 'lastName', 'password', 'email', 'birthdate'];
const optionalProperties = ['bio', 'gender', 'active', 'lat', 'lon', 'sexOrient', 'ageMin', 'ageMax', 'tags', 'isTags', 'photos', 'localisation', 'optional', 'isAdmin'];
const amount = 100;
const latLonBox = { minLat: 47.11, maxLat: 48.31, minLon: 1.00, maxLon: 3.41 };
function rand(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randFloat(min, max) {
  return Math.random() * (max - min) + min;;
}

const admin = {
  username: 'camille',
  firstName: 'Camille',
  lastName: 'Julien',
  gender: 'male',
  sexOrient: 'hetero',
  password: 'Test12345*',
  email: 'camille@gmail.com',
  localisation: 42,
  birthdate: '1992-03-27',
  ageMin: 18,
  ageMax: 99,
  photos: ['https://uinames.com/api/photos/male/19.jpg', 'https://uinames.com/api/photos/male/17.jpg'],
  tags: [{ id: 'athlete', text: 'something' }, { id: 'book', text: 'lala' }],
  isTags: [{ id: 'geek', text: 'something' }, { id: 'book', text: 'lala' }],
  isAdmin: 'true',
  complete: 'true',
  active: 'true',
  lat: '47.37',
  lon: '-3.22',
};

const admin2 = {
  username: 'philoutre',
  firstName: 'Philoutre',
  lastName: 'Philoutre',
  password: 'Test12*',
  gender: 'female',
  sexOrient: 'hetero',
  ageMin: 18,
  localisation: 42,
  ageMax: 99,
  email: 'Philoutre@gmail.com',
  birthdate: '1996-02-14',
  tags: [{ id: 'athlete', text: 'something' }, { id: 'book', text: 'lala' }],
  isTags: [{ id: 'geek', text: 'something' }, { id: 'book', text: 'lala' }],
  isAdmin: 'true',
  complete: 'true',
  active: 'true',
  lat: '47.39',
  lon: '-3.20',
  photos: ['https://uinames.com/api/photos/female/19.jpg', 'https://uinames.com/api/photos/female/17.jpg'],
};

const tags = [
  { id: 'cinema', text: 'Cinema Lover' },
  { id: 'traveler', text: 'Traveler' },
  { id: 'cat', text: 'Cat Person' },
  { id: 'dog', text: 'Dog Person' },
  { id: 'nature', text: 'Nature Lover' },
  { id: 'family', text: 'Family-Oriented' },
  { id: 'party', text: 'Party Animal' },
  { id: 'book', text: 'Bookworm' },
  { id: 'extrovert', text: 'Extrovert' },
  { id: 'introvert', text: 'Introvert' },
  { id: 'creative', text: 'Creative' },
  { id: 'animal', text: 'Animal Lover' },
  { id: 'arts', text: 'Patron of the Arts' },
  { id: 'athlete', text: 'Athlete' },
  { id: 'geek', text: 'Geek' },
];

function randomTags(users) {
  return new Promise((resolve, reject) => {
    users.forEach((user) => {
      const len = tags.length;
      const random1 = rand(0, len - 1);
      const random2 = rand(0, len - 1);
      const random3 = rand(0, len - 1);
      user.tags.push(tags[random1]);
      if (random2 !== random1) user.tags.push(tags[random2]);
      if (random3 !== random2 && random3 !== random1) user.tags.push(tags[random3]);
    });
    resolve(users);
  });
}

function randomIsTags(users) {
  return new Promise((resolve, reject) => {
    users.forEach((user) => {
      const len = tags.length;
      const random1 = rand(0, len - 1);
      const random2 = rand(0, len - 1);
      const random3 = rand(0, len - 1);
      user.isTags.push(tags[random1]);
      if (random2 !== random1) user.isTags.push(tags[random2]);
      if (random3 !== random2 && random3 !== random1) user.isTags.push(tags[random3]);
    });
    resolve(users);
  });
}


function userParser(user) {
  return new Promise((resolve, reject) => {
    if (user !== undefined) {
      const newUser = _.pick(user, props);
      newUser.username = `${user.name.toLowerCase()}${rand(1, 99)}`.replace(/ /, '');
      newUser.lastName = user.surname.replace(/ /, '');
      newUser.firstName = user.name.replace(/ /, '');
      newUser.password = 'Test123456*';
      newUser.photos = [user.photo];
      newUser.bio = 'I love Chicken';
      newUser.localisation = rand(5, 100);
      const date = new Date(user.birthday.raw * 1000);
      const year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDay();
      if (month === 0) month += 1;
      if (month < 10) month = `0${month}`;
      if (day === 0) day += 1;
      if (day < 10) day = `0${day}`;
      const birthdate = `${year}-${month}-${day}`;
      newUser.birthdate = birthdate;
      const sexOrient = rand(1, 5);
      if (sexOrient === 1 || sexOrient === 5) newUser.sexOrient = 'hetero';
      else if (sexOrient === 2) newUser.sexOrient = 'homo';
      else if (sexOrient === 3) newUser.sexOrient = 'bi';
      else if (sexOrient === 4) newUser.sexOrient = 'pan';
      newUser.ageMin = rand(18, 35);
      newUser.ageMax = rand(newUser.ageMin + 5, 100);
      newUser.tags = [];
      newUser.isTags = [];
      newUser.active = 'true';
      const lat = randFloat(48.856613 - 0.7, 48.856613 + 0.7);
      const lon = randFloat(2.352222 - 0.7, 2.352222 + 0.7);
      debug(lat, lon);
      newUser.lat = lat;
      newUser.lon = lon;
      resolve(newUser);
    }
  });
}

function getUsers() {
  let users = [];
  return new Promise((resolve, reject) => {
    axios.get(`https://uinames.com/api/?amount=${amount}&region=france&ext`)
      .then((res) => {
        const promises = res.data.map(user => (userParser(user)));
        return (Promise.all(promises));
      })
      .then((res) => {
        users = res;
        return axios.get(`https://uinames.com/api/?amount=${amount}&region=france&ext`);
      })
      .then((res) => {
        const promises = res.data.map(user => (userParser(user)));
        return (Promise.all(promises));
      })
      .then((res) => {
        users = _.concat(users, res);
        return axios.get(`https://uinames.com/api/?amount=${amount}&region=france&ext`);
      })
      .then((res) => {
        const promises = res.data.map(user => (userParser(user)));
        return (Promise.all(promises));
      })
      .then((res) => {
        users = _.concat(users, res);
        return axios.get(`https://uinames.com/api/?amount=${amount}&region=france&ext`);
      })
      .then((res) => {
        const promises = res.data.map(user => (userParser(user)));
        return (Promise.all(promises));
      })
      .then((res) => {
        users = _.concat(users, res);
        return axios.get(`https://uinames.com/api/?amount=${amount}&region=france&ext`);
      })
      .then((res) => {
        const promises = res.data.map(user => (userParser(user)));
        return (Promise.all(promises));
      })
      .then((res) => {
        users = _.concat(users, res);
        return axios.get(`https://uinames.com/api/?amount=${amount}&region=france&ext`);
      })
      .then((res) => {
        const promises = res.data.map(user => (userParser(user)));
        return (Promise.all(promises));
      })
      .then((res) => { users = _.concat(users, res); debug(users.length); resolve(users); })
      .catch(err => debug(err));
  });
}

function createSeed() {
  return getUsers()
    .then(users => randomTags(users))
    .then(users => randomIsTags(users))
    .then((users) => {
      users.push(admin);
      users.push(admin2);
      const data = JSON.stringify(users);
      // const stream = fs.createWriteStream('./src/init/seed.json');
      // stream.write(data);
      fs.writeFile('./src/init/seed.json', data, (err) => { debug(err); });
    })
    .catch(err => debug(err));
}

module.exports = createSeed;
