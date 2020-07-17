/* eslint-disable max-len */
const debug = require('debug')('tests:user_route');
const _ = require('lodash');
const axios = require('axios');
const userTemplate = require('../../../util/userTemplate');

const infos = _.without(Object.keys(userTemplate), 'tags');
const route = 'http://localhost:4000/api';

const validNewUser = {
  username: 'testUser',
  firstName: 'testFname',
  lastName: 'testLname',
  gender: 'male',
  bio: ' THIS IS A TEST!',
  localisation: 77,
  ageMin: 18,
  ageMax: 99,
  password: 'Test12345*',
  email: 'testmail@gmail.com',
  birthdate: '1992-03-27',
  tags: [{ id: 'athlete', text: 'something' }, { id: 'book', text: 'lala' }],
  isTags: [{ id: 'cat', text: 'something' }, { id: 'book', text: 'lala' }],
  isAdmin: 'true',
};

const validNewUser2 = {
  username: 'testUser2',
  firstName: 'testFname',
  lastName: 'testLname',
  gender: 'male',
  bio: ' THIS IS A TEST!',
  localisation: 77,
  ageMin: 18,
  ageMax: 99,
  password: 'Test12345*',
  email: 'testmail2@gmail.com',
  birthdate: '1992-03-27',
  tags: [{ id: 'athlete', text: 'something' }, { id: 'book', text: 'lala' }],
  isTags: [{ id: 'cat', text: 'something' }, { id: 'book', text: 'lala' }],
  isAdmin: 'true',
};

const updatedUSer = {
  username: 'testUser',
  sexOrient: 'hetero',
  isTags: [{ id: 'dog', text: 'something' }],
  isAdmin: 'true',
};

test('GET request : username list expect username array', async () => {
  const res = await axios.get(`${route}/users/username`);
  return expect(res.data.success).toBe(true);
});

test('POST request : /api/users, valid user expect user created', async () => {
  const res = await axios.post(`${route}/users`, validNewUser, null);
  return expect(res.data.success).toBe(true);
});

test('POST request : /api/users, valid user expect user created', async () => {
  const res = await axios.post(`${route}/users`, validNewUser2, null);
  return expect(res.data.success).toBe(true);
});

test('POST request : /api/auth, expect valid jwt', async () => {
  const res = await axios.post(`${route}/auth`, validNewUser, null);
  return expect(res.data.payload).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
});

test('GET request : user infos, expect user infos', async () => {
  const token = await axios.post(`${route}/auth`, validNewUser, null);
  const res = await axios.get(`${route}/users/infos/${updatedUSer.username}`, { headers: { 'x-auth-token': token.data.payload } });
  return expect(res.data.payload.result.username).toBe('testUser');
});

test('GET request : infos array, expect suggestions lists', async () => {
  const token = await axios.post(`${route}/auth`, validNewUser, null);
  const res = await axios.get(`${route}/users/suggestions/${updatedUSer.username}`, { headers: { 'x-auth-token': token.data.payload } });
  return expect(res.data.success).toBe(true);
});

test('POST request : testUser2 visits testUser', async () => {
  const token = await axios.post(`${route}/auth`, validNewUser2, null);
  const res = await axios.post(`${route}/users/${validNewUser2.username}/visit/${updatedUSer.username}`, null, { headers: { 'x-auth-token': token.data.payload } });
  return expect(res.data.success).toBe(true);
});

test('POST request : testUser2 visits testUser', async () => {
  const token = await axios.post(`${route}/auth`, validNewUser2, null);
  const body = {
    node_a: {
      label: 'User',
      id: 'username',
      properties: {
        username: validNewUser2.username,
      },
    },
    node_b: {
      label: 'User',
      id: 'username',
      properties: {
        username: validNewUser.username,
      },
    },
    relation: {
      label: 'LIKES',
      properties: {},
    },
  };
  const res = await axios.post(`${route}/relationships/toggle`, body, { headers: { 'x-auth-token': token.data.payload } });
  return expect(res.data.success).toBe(true);
});

test('GET request : get visit history', async () => {
  const token = await axios.post(`${route}/auth`, validNewUser, null);
  const res = await axios.get(`${route}/users/${updatedUSer.username}/visits`, { headers: { 'x-auth-token': token.data.payload } });
  return expect(res.data.success).toBe(true);
});

test('GET request : get liked history', async () => {
  const token = await axios.post(`${route}/auth`, validNewUser, null);
  const res = await axios.get(`${route}/users/${updatedUSer.username}/likedBy`, { headers: { 'x-auth-token': token.data.payload } });
  return expect(res.data.success).toBe(true);
});

// test('PUT request : /api/users, successful update', async () => {
//   const token = await axios.post(`${route}/auth`, validNewUser, null);
//   const res = await axios.put(`${route}/users/${updatedUSer.username}`, updatedUSer, { headers: { 'x-auth-token': token.data.payload } });
//   return expect(res.data.success).toBe(true);
// });

// test('GET request : infos array, expect suggestions lists', async () => {
//   const res = await axios.get(`${route}/users//suggestions/${updatedUSer.username}`, null, null);
//   return expect(res.data.success).toBe(true);
// });
