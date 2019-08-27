const debug = require('debug')('app:test');
const each = require('jest-each').default;
const Validator = require('../models/validator');

// Valid Inpput tests

const validUsers = [
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

const requirements = {
  username: false,
  password: false,
  email: false,
  birthyear: false,
  optional: false,
  isAdmin: false,
};

each`
  property    | requirement    | expected
  ${validUsers[0]} | ${requirements} | ${validUsers[0]}
  ${validUsers[1]} | ${requirements} | ${validUsers[1]}
  ${validUsers[2]} | ${requirements} | ${validUsers[2]}
  ${validUsers[3]} | ${requirements} | ${validUsers[3]}
  ${validUsers[4]} | ${requirements} | ${validUsers[4]}
`.test('Valid input: $property\n Requirements: $requirement\n Expected: $expected\n', ({ property, requirement, expected }) => {
    const promise = new Validator(requirement, property).validate();
    expect(promise).resolves.toBe(expected).catch(err => debug(err));
  });
