const Validator = require('../models/validator');

const schema = {
  property: ['validValue', 'invalidValue'],
};

const username = {
  validValue: 'JeanMich',
  invalidValue: '123456',
};

const password = {
  validValue: 'Test12345*',
  invalidValue: 'tabouret',
};

const email = {
  validValue: 'kamillejulien@gmail.com',
  invalidValue: 'tabouret',
};

const birthyear = {
  validValue: '1998',
  invalidValue: 'tabouret',
};

const optional = {
  validValue: 'jaimeleschevres',
  invalidValue: '123 456',
};

const isAdmin = {
  validValue: true,
  invalidValue: 'yes',
};

const test = {
  validValue: 'test',
  invalidValue: 'test',
};

const required = [true, false];
const properties = ['username', 'password', 'email', 'birthyear', 'optional', 'isAdmin', 'test'];

const template = [
  username,
  password,
  email,
  birthyear,
  optional,
  isAdmin,
  test,
];

// test('Validator - username - required and passed', () => {
//   const result = new Validator(reqU, uTrue).validate();
//   expect(result).resolves.toEqual(uTrue);
// });

// test('Validator - username - required and not passed', () => {
//   const result = new Validator(reqU, uFalse).validate();
//   expect(result).rejects.toEqual(Error);
// });

function templatedTest(testedProperty, isRequired, valid, property, requirement) {
  test(`validator-${testedProperty}-${isRequired}-${valid}`, () => {
    if (isRequired && valid) {
      const result = new Validator(requirement, property.validValue);
      expect(result).resolves.toEqual(property);
    } else if (isRequired && !valid) {
      const result = new Validator(requirement, property.invalidValue);
      expect(result).rejects.toEqual(Error);
    } else if (!isRequired && !valid) {
      const result = new Validator(requirement, property.invalidValue);
      expect(result).rejects.toEqual(Error);
    } else if (!isRequired && valid) {
      const result = new Validator(requirement, property.invalidValue);
      expect(result).resolves.toEqual(property);
    }
  });
}

test('Validator', () => {
  properties.forEach((property) => {
    required.forEach((bool) => {
      const requirement = {};
      requirement[property] = bool;
      templatedTest(property, bool, bool, template[property], requirement);
      templatedTest(property, bool, !bool, template[property], requirement);
      templatedTest(property, !bool, bool, template[property], requirement);
      templatedTest(property, !bool, !bool, template[property], requirement);
      requirement[property] = !bool;
      templatedTest(property, bool, bool, template[property], requirement);
      templatedTest(property, bool, !bool, template[property], requirement);
      templatedTest(property, !bool, bool, template[property], requirement);
      templatedTest(property, !bool, !bool, template[property], requirement);
    });
  });
});
