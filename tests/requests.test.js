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

test('GET request : /api/users/user, expect user list, true', async () => {
  const data = await new Request('/api/users', null).get().catch(err => debug(err));
  return expect(data).toBeTruthy();
});

test('GET request : /api/users/user, invalid Auth expect false', async () => {
  const data = await new Request('/api/users/Claude', null).get().catch(err => debug(err));
  return expect(data).toBe(false);
});

test('POST request : /api/auth, expect valid jwt', async () => {
  const data = await new Request('/api/auth', validUserAuth).authenticate().catch(err => debug(err));
  return expect(data).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
});
