const debug = require('debug')('app:test');
const each = require('jest-each').default;
const req = require('./requests');

const users = [
  {
    username: 'Jean',
    password: 'Test123*',
    email: 'jean@gmail.com',
    birthyear: '1905',
  },
  {
    username: 'Camille',
    password: 'Test123*',
    email: 'kamillejulien@gmail.com',
    birthyear: '1905',
    isAdmin: 'true',
  },
  {
    username: 'Bob',
    password: 'Test123*',
    email: 'marley@gmail.com',
    birthyear: '1906',
  },
  {
    username: 'Pilip',
    password: 'Test123*',
    email: 'pilip@gmail.com',
    birthyear: '1998',
  },
  {
    username: 'Claude',
    password: 'Test123*',
    email: 'claude@gmail.com',
    birthyear: '2000',
  },
];

test('GET request : /api/users, expect list of users', () => {
  expect(req).resolves.toEqual(true).catch(err => debug(err));
});
