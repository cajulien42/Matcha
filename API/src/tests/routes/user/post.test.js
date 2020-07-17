/* eslint-disable max-len */
const debug = require('debug')('tests:user_route');
const _ = require('lodash');
const axios = require('axios');
const userTemplate = require('../../../util/userTemplate');

const infos = _.without(Object.keys(userTemplate), 'tags');
const route = 'http://localhost:4000/api/users';

const validNewUser = {
  username: 'camille777',
  firstName: 'Camille',
  lastName: 'Julien',
  gender: 'male',
  sexOrient: 'hetero',
  bio: ' THIS IS A TEST!',
  localisation: '77',
  ageMin: 18,
  ageMax: 99,
  password: 'Test12345*',
  email: 'camille777@gmail.com',
  birthdate: '1992-03-27',
  tags: [{ id: 'athlete', text: 'something' }, { id: 'book', text: 'lala' }],
  isAdmin: 'true',
};

test('POST request : /api/users, valid user expect user created', async () => {
  const res = await axios.post(`${route}/`, validNewUser, null);
  return expect(res.data.success).toBe(true);
});

// test('POST request : /api/auth, expect valid jwt', async () => {
//   const data = await new Request('/api/auth', validNewUser, null).post().catch(err => debug(err));
//   return expect(data).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
// });

// test('POST request : /api/users, valid user expect user created', async () => {
//   const data = await new Request('/api/users/', adminUser, null).post().catch(err => debug(err));
//   console.log(data);
//   return expect(data).toBeTruthy();
// });

// test('POST request : /api/auth, expect valid jwt', async () => {
//   const data = await new Request('/api/auth', validUserAuth, null).post().catch(err => debug(err));
//   return expect(data).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
// });

// test('POST request : /api/auth, invalid user expect 400 error', async () => {
//   const data = await new Request('/api/auth', invalidUserAuth, null).post().catch(err => debug(err));
//   return expect(data).toBe(false);
// });

// test('POST request : /api/users, valid user expect user created', async () => {
//   const data = await new Request('/api/users/', validNewUser, null).post().catch(err => debug(err));
//   return expect(data).toBeTruthy();
// });


// test('POST request : /api/users, user exists expect 400 error', async () => {
//   const data = await new Request('/api/users/', validNewUser, null).post().catch(err => debug(err));
//   return expect(data).toBe(false);
// });

// test('POST request : /api/users, invalid user expect error', async () => {
//   const data = await new Request('/api/users/', invalidNewUser, null).post().catch(err => debug(err));
//   return expect(data).toBe(false);
// });

// test('POST request : /api/auth, invalid user expect 400:bad request error', async () => {
//   const data = await new Request('/api/auth', invalidUserAuth).post().catch(err => debug(err));
//   return expect(data).toBe(false);
// });

// test('POST request : /api/auth, expect valid jwt', async () => {
//   const data = await new Request('/api/auth', updatedUser).post().catch(err => debug(err));
//   return expect(data).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
// });
