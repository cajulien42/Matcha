const debug = require('debug')('app:test');
const each = require('jest-each').default;
// const getUsers = require('./requests');
const Request = require('./requestsClass');

// test('GET request : /api/users, expect list of users', () => (
//   getUsers.then((data) => {
//     expect(data).toBeTruthy();
//   })
//     .catch(err => debug(err))
// ));

const validUserAuth = {
  username: 'Jean',
  password: 'Test123*',
};

const invalidUserAuth = {
  username: 'Jean',
  password: 'Test12*',
};

const newUser = {
  username: 'Claudinete',
  password: 'Test12345*',
  email: 'cludne@gmail.com',
  birthyear: '1905',
  optional: 'lalala',
  isAdmin: 'true',
};

const updatedUser = {
  username: 'Jean',
  password: 'Test1234*',
  optional: 'truc',
};

test('GET request : /api/users/user, expect user list, true', async () => {
  const data = await new Request('/api/users', null).get().catch(err => debug(err));
  return expect(data).toBeTruthy();
});

test('GET request : /api/users/user, invalid Auth expect 401 error', async () => {
  const data = await new Request('/api/users/Claude', null).get().catch(err => debug(err));
  return expect(data).toBe(false);
});

test('POST request : /api/auth, expect valid jwt', async () => {
  const data = await new Request('/api/auth', validUserAuth).post().catch(err => debug(err));
  return expect(data).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
});

test('POST request : /api/auth, invalid user expect 400 error', async () => {
  const data = await new Request('/api/auth', invalidUserAuth).post().catch(err => debug(err));
  return expect(data).toBe(false);
});

test('GET request : /api/users/Jean, expect user info, true', async () => {
  const data = await new Request('/api/auth', validUserAuth).post().catch(err => debug(err));
  const res = await new Request('/api/users/Jean', data).get().catch(err => debug(err));
  return expect(res).toBeTruthy();
});

test('POST request : /api/users, valid user expect user created', async () => {
  const data = await new Request('/api/users/', newUser).post().catch(err => debug(err));
  return expect(data).toBeTruthy();
});

test('PUT request : /api/users/Jean, valid user expect user created', async () => {
  const req = {};
  req.user = updatedUser;
  req.token = await new Request('/api/auth', validUserAuth).post().catch(err => debug(err));
  const res = await new Request('/api/users/Jean', req).put().catch(err => debug(err));
  return expect(res).toBeTruthy();
});
