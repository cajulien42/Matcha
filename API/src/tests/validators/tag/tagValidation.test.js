const debug = require('debug')('tests:tag_validation');
const each = require('jest-each').default;
const _ = require('lodash');
const TagValidator = require('../../../validation/tags');
const incompleteTagData = require('../../data/tags/incompleteTags');
const validTagData = require('../../data/tags/validTags');
const invalidTagData = require('../../data/tags/invalidTags');
const tagTemplate = require('../../../util/tagTemplate');

const noRequirements = {};
const fullRequirements = {};

Object.keys(tagTemplate).forEach((property) => {
  noRequirements[property] = false;
  fullRequirements[property] = true;
});

const validArray = [];
validTagData.forEach((tag) => {
  validArray.push([tag, noRequirements, true]);
});

const invalidArray = [];
invalidTagData.forEach((tag) => {
  invalidArray.push([tag, noRequirements, undefined]);
});

const incompleteArray = [];
incompleteTagData.forEach((tag) => {
  incompleteArray.push([tag, fullRequirements, undefined]);
});

each`
  property    | requirement    | expected
  ${validArray[0][0]} | ${validArray[0][1]} | ${validArray[0][2]}
  ${validArray[1][0]} | ${validArray[1][1]} | ${validArray[1][2]}
  ${validArray[2][0]} | ${validArray[2][1]} | ${validArray[2][2]}
  ${validArray[3][0]} | ${validArray[3][1]} | ${validArray[3][2]}
  ${validArray[4][0]} | ${validArray[4][1]} | ${validArray[4][2]}
  ${validArray[5][0]} | ${validArray[5][1]} | ${validArray[5][2]}
  ${validArray[6][0]} | ${validArray[6][1]} | ${validArray[6][2]}
  ${validArray[7][0]} | ${validArray[7][1]} | ${validArray[7][2]}
  ${validArray[8][0]} | ${validArray[8][1]} | ${validArray[8][2]}
  ${validArray[9][0]} | ${validArray[9][1]} | ${validArray[9][2]}
`.test('Valid inputs: $property\n Requirements: $requirement\n Expected: $expected\n',
    async ({ property, requirement, expected }) => {
      const promise = await new TagValidator(requirement, property).validate()
        .catch(err => debug(err));
      return expect(promise.success).toBe(expected);
    });

each`
  property    | requirement    | expected
  ${incompleteArray[0][0]} | ${incompleteArray[0][1]} | ${incompleteArray[0][2]}
  ${incompleteArray[1][0]} | ${incompleteArray[1][1]} | ${incompleteArray[1][2]}
`.test('Incomplete inputs: $property\n Requirements: $requirement\n Expected: $expected\n',
    async ({ property, requirement, expected }) => {
      const promise = await new TagValidator(requirement, property).validate()
        .catch(err => debug(err));
      return expect(promise).toBe(expected);
    });

each`
  property    | requirement    | expected
  ${invalidArray[0][0]} | ${invalidArray[0][1]} | ${invalidArray[0][2]}
  ${invalidArray[1][0]} | ${invalidArray[1][1]} | ${invalidArray[1][2]}
`.test('Invalid inputs: $property\n Requirements: $requirement\n Expected: $expected\n',
    async ({ property, requirement, expected }) => {
      const promise = await new TagValidator(requirement, property).validate()
        .catch(err => debug(err));
      return expect(promise).toBe(expected);
    });
