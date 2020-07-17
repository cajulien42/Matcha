const debug = require('debug')('tests:user_validation');
const each = require('jest-each').default;
const _ = require('lodash');
const UserValidator = require('../../../validation/users');
const incompleteUserData = require('../../data/users/incompleteUsers');
const validUserData = require('../../data/users/validUsers');
const invalidUserData = require('../../data/users/invalidUsers');
const userTemplate = require('../../../util/userTemplate');

const noRequirements = {};
const fullRequirements = {};

Object.keys(userTemplate).forEach((property) => {
  noRequirements[property] = false;
  fullRequirements[property] = true;
});

const validArray = [];
validUserData.forEach((user) => {
  validArray.push([user, noRequirements, true]);
});

const invalidArray = [];
invalidUserData.forEach((user) => {
  invalidArray.push([user, noRequirements, undefined]);
});

const incompleteArray = [];
incompleteUserData.forEach((user) => {
  incompleteArray.push([user, fullRequirements, undefined]);
});

each`
  property    | requirement    | expected
  ${validArray[0][0]} | ${validArray[0][1]} | ${validArray[0][2]}
  ${validArray[1][0]} | ${validArray[1][1]} | ${validArray[1][2]}
  ${validArray[2][0]} | ${validArray[2][1]} | ${validArray[2][2]}
  ${validArray[3][0]} | ${validArray[3][1]} | ${validArray[3][2]}
  ${validArray[4][0]} | ${validArray[4][1]} | ${validArray[4][2]}
`.test('Valid inputs: $property\n Requirements: $requirement\n Expected: $expected\n',
    async ({ property, requirement, expected }) => {
      const promise = await new UserValidator(requirement, property).validate()
        .catch(err => debug(err));
      return expect(promise.success).toBe(expected);
    });

each`
  property    | requirement    | expected
  ${incompleteArray[0][0]} | ${incompleteArray[0][1]} | ${incompleteArray[0][2]}
  ${incompleteArray[1][0]} | ${incompleteArray[1][1]} | ${incompleteArray[1][2]}
  ${incompleteArray[2][0]} | ${incompleteArray[2][1]} | ${incompleteArray[2][2]}
  ${incompleteArray[3][0]} | ${incompleteArray[3][1]} | ${incompleteArray[3][2]}
  ${incompleteArray[4][0]} | ${incompleteArray[4][1]} | ${incompleteArray[4][2]}
  ${incompleteArray[5][0]} | ${incompleteArray[5][1]} | ${incompleteArray[5][2]}
  ${incompleteArray[6][0]} | ${incompleteArray[6][1]} | ${incompleteArray[6][2]}
  ${incompleteArray[7][0]} | ${incompleteArray[7][1]} | ${incompleteArray[7][2]}
  ${incompleteArray[8][0]} | ${incompleteArray[8][1]} | ${incompleteArray[8][2]}
  ${incompleteArray[9][0]} | ${incompleteArray[9][1]} | ${incompleteArray[9][2]}
  ${incompleteArray[10][0]} | ${incompleteArray[10][1]} | ${incompleteArray[10][2]}
  ${incompleteArray[11][0]} | ${incompleteArray[11][1]} | ${incompleteArray[11][2]}
  ${incompleteArray[12][0]} | ${incompleteArray[12][1]} | ${incompleteArray[12][2]}
  ${incompleteArray[13][0]} | ${incompleteArray[13][1]} | ${incompleteArray[13][2]}
  ${incompleteArray[14][0]} | ${incompleteArray[14][1]} | ${incompleteArray[14][2]}
`.test('Incomplete inputs: $property\n Requirements: $requirement\n Expected: $expected\n',
    async ({ property, requirement, expected }) => {
      const promise = await new UserValidator(requirement, property).validate()
        .catch(err => debug(err));
      return expect(promise).toBe(expected);
    });

each`
  property    | requirement    | expected
  ${invalidArray[0][0]} | ${invalidArray[0][1]} | ${invalidArray[0][2]}
  ${invalidArray[1][0]} | ${invalidArray[1][1]} | ${invalidArray[1][2]}
  ${invalidArray[2][0]} | ${invalidArray[2][1]} | ${invalidArray[2][2]}
  ${invalidArray[3][0]} | ${invalidArray[3][1]} | ${invalidArray[3][2]}
  ${invalidArray[4][0]} | ${invalidArray[4][1]} | ${invalidArray[4][2]}
  ${invalidArray[5][0]} | ${invalidArray[5][1]} | ${invalidArray[5][2]}
  ${invalidArray[6][0]} | ${invalidArray[6][1]} | ${invalidArray[6][2]}
  ${invalidArray[7][0]} | ${invalidArray[7][1]} | ${invalidArray[7][2]}
  ${invalidArray[8][0]} | ${invalidArray[8][1]} | ${invalidArray[8][2]}
  ${invalidArray[9][0]} | ${invalidArray[9][1]} | ${invalidArray[9][2]}
  ${invalidArray[10][0]} | ${invalidArray[10][1]} | ${invalidArray[10][2]}
  ${invalidArray[11][0]} | ${invalidArray[11][1]} | ${invalidArray[11][2]}
  ${invalidArray[12][0]} | ${invalidArray[12][1]} | ${invalidArray[12][2]}
  ${invalidArray[13][0]} | ${invalidArray[13][1]} | ${invalidArray[13][2]}
  ${invalidArray[14][0]} | ${invalidArray[14][1]} | ${invalidArray[14][2]}
  ${invalidArray[15][0]} | ${invalidArray[15][1]} | ${invalidArray[15][2]}
  ${invalidArray[16][0]} | ${invalidArray[16][1]} | ${invalidArray[16][2]}
  ${invalidArray[17][0]} | ${invalidArray[17][1]} | ${invalidArray[17][2]}
  ${invalidArray[18][0]} | ${invalidArray[18][1]} | ${invalidArray[18][2]}
  ${invalidArray[19][0]} | ${invalidArray[19][1]} | ${invalidArray[19][2]}
  ${invalidArray[20][0]} | ${invalidArray[20][1]} | ${invalidArray[20][2]}
  ${invalidArray[21][0]} | ${invalidArray[21][1]} | ${invalidArray[21][2]}
  ${invalidArray[22][0]} | ${invalidArray[22][1]} | ${invalidArray[22][2]}
  ${invalidArray[23][0]} | ${invalidArray[23][1]} | ${invalidArray[23][2]}
  ${invalidArray[24][0]} | ${invalidArray[24][1]} | ${invalidArray[24][2]}
  ${invalidArray[25][0]} | ${invalidArray[25][1]} | ${invalidArray[25][2]}
  ${invalidArray[26][0]} | ${invalidArray[26][1]} | ${invalidArray[26][2]}
  ${invalidArray[27][0]} | ${invalidArray[27][1]} | ${invalidArray[27][2]}
  ${invalidArray[28][0]} | ${invalidArray[28][1]} | ${invalidArray[28][2]}
  ${invalidArray[29][0]} | ${invalidArray[29][1]} | ${invalidArray[29][2]}
  ${invalidArray[30][0]} | ${invalidArray[30][1]} | ${invalidArray[30][2]}
  ${invalidArray[31][0]} | ${invalidArray[31][1]} | ${invalidArray[31][2]}
  ${invalidArray[32][0]} | ${invalidArray[32][1]} | ${invalidArray[32][2]}
  ${invalidArray[33][0]} | ${invalidArray[33][1]} | ${invalidArray[33][2]}
  ${invalidArray[34][0]} | ${invalidArray[34][1]} | ${invalidArray[34][2]}
  ${invalidArray[35][0]} | ${invalidArray[35][1]} | ${invalidArray[35][2]}
  ${invalidArray[36][0]} | ${invalidArray[36][1]} | ${invalidArray[36][2]}
  ${invalidArray[37][0]} | ${invalidArray[37][1]} | ${invalidArray[37][2]}
  ${invalidArray[38][0]} | ${invalidArray[38][1]} | ${invalidArray[38][2]}
  ${invalidArray[39][0]} | ${invalidArray[39][1]} | ${invalidArray[39][2]}
`.test('Invalid inputs: $property\n Requirements: $requirement\n Expected: $expected\n',
    async ({ property, requirement, expected }) => {
      const promise = await new UserValidator(requirement, property).validate()
        .catch(err => debug(err));
      return expect(promise).toBe(expected);
    });
