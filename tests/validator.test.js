const debug = require('debug')('app:test');
const each = require('jest-each').default;
const Validator = require('../models/validator');
const userTemplate = require('./usertemplate');

const noRequirements = {
  username: false,
  password: false,
  email: false,
  birthyear: false,
  optional: false,
  isAdmin: false,
};

const fullRequirements = {
  username: true,
  password: true,
  email: true,
  birthyear: true,
  optional: true,
  isAdmin: true,
};

// Valid Inputs
const validData = {};

Object.keys(userTemplate).forEach((key) => {
  validData[key] = userTemplate[key].valid;
});


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

// Invalid Inputs

const invalidUsers = [
  {
    username: 'Jean',
    password: 'Test123', // Unsecure password
    email: 'jean@gmail.com',
    birthyear: '1905',
  },
  {
    username: 'Camille',
    password: 'Test123*',
    email: 'kamillejulien@gmailcom', // Invalid email
    birthyear: '1905',
    isAdmin: 'true',
  },
  {
    username: 'Bob',
    password: 'Test123*',
    email: 'marley@gmail.com',
    birthyear: '2020', // Invalide birthyear
  },
  {
    username: 'Pilip-2', // Invalid username
    password: 'Test123*',
    email: 'pilip@gmail.com',
    birthyear: '1998',
  },
  {
    username: 'Pilip2',
    password: 'Test123*',
    email: 'pilip@gmail.com',
    birthyear: '1998',
    optional: '987*', // Invalid optional
  },
];

const incompleteUsers = [
  {
    // Missing username
    password: 'Test123*',
    email: 'kamillejulien@gmail.com',
    birthyear: '1905',
    isAdmin: 'true',
    optional: 'test',
  },
  {
    username: 'Camille',
    // Missing password
    email: 'kamillejulien@gmail.com',
    birthyear: '1905',
    isAdmin: 'true',
    optional: 'test',
  },
  {
    username: 'Camille',
    password: 'Test123*',
    // Missing email
    birthyear: '1905',
    isAdmin: 'true',
    optional: 'test',
  },
  {
    username: 'Camille',
    password: 'Test123*',
    email: 'kamillejulien@gmail.com',
    // Missing birthyear
    isAdmin: 'true',
    optional: 'test',
  },
  {
    username: 'Camille',
    password: 'Test123*',
    email: 'kamillejulien@gmail.com',
    birthyear: '1905',
    // Missing isAdmin
    optional: 'test',
  },
  {
    username: 'Camille',
    password: 'Test123*',
    email: 'kamillejulien@gmail.com',
    birthyear: '1905',
    isAdmin: 'true',
    // Missing optional
  },
];

each`
  property    | requirement    | expected
  ${validUsers[0]} | ${noRequirements} | ${true}
  ${validUsers[1]} | ${noRequirements} | ${true}
  ${validUsers[2]} | ${noRequirements} | ${true}
  ${validUsers[3]} | ${noRequirements} | ${true}
  ${validUsers[4]} | ${noRequirements} | ${true}
`.test('Valid input: $property\n noRequirements: $requirement\n Expected: $expected\n', async ({ property, requirement, expected }) => {
    const promise = await new Validator(requirement, property).validate().catch(err => debug(err));
    return expect(promise.success).toBe(expected);
  });

each`
  property    | requirement    | expected
  ${invalidUsers[0]} | ${noRequirements} | ${undefined}
  ${invalidUsers[1]} | ${noRequirements} | ${undefined}
  ${invalidUsers[2]} | ${noRequirements} | ${undefined}
  ${invalidUsers[3]} | ${noRequirements} | ${undefined}
  ${invalidUsers[4]} | ${noRequirements} | ${undefined}
`.test('Invalid input: $property\n Requirements: $requirement\n Expected: validation error\n', async ({ property, requirement, expected }) => {
    const promise = await new Validator(requirement, property).validate().catch(err => debug(err));
    return expect(promise).toBe(expected);
  });

each`
  property    | requirement    | expected
  ${incompleteUsers[0]} | ${fullRequirements} | ${undefined}
  ${incompleteUsers[1]} | ${fullRequirements} | ${undefined}
  ${incompleteUsers[2]} | ${fullRequirements} | ${undefined}
  ${incompleteUsers[3]} | ${fullRequirements} | ${undefined}
  ${incompleteUsers[4]} | ${fullRequirements} | ${undefined}
`.test('Incomplete input: $property\n Requirements: $requirement\n Expected: validation error\n', async ({ property, requirement, expected }) => {
    const promise = await new Validator(requirement, property).validate().catch(err => debug(err));
    return expect(promise).toBe(expected);
  });
