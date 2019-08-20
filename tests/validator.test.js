const Validator = require('../models/validator');

const reqU = {
  username: true,
};

const uTrue = {
  username: 'JeanMich',
};

const uFalse = {
  email: 'lala',
};

const uInc = {
  username: 79841,
};

test('Validator - username - required and passed', () => {
  const result = new Validator(reqU, uTrue).validate();
  expect(result).resolves.toEqual(uTrue);
});

test('Validator - username - required and not passed', () => {
  const result = new Validator(reqU, uFalse).validate();
  expect(result).rejects.toEqual(Error);
});
