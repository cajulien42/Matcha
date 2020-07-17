
module.exports = {
  username: {
    type: 'string',
    valid: ['Pilip2', 'Jean', 'claude', 'user4test', '78945', 'noé'],
    invalid: ['a', 'truc_', 'qwertyuiopasdfghjklzxcvbnm123456789123456789', '123', 'yol', 0, null],
    public: true,
    unique: true,
  },
  firstName: {
    type: 'string',
    valid: ['Pilip', 'Jean', 'claude', 'CAMENBERT', 'trucmuch'],
    invalid: ['a', 'truc_', 'qwertyuiopasdfghjklzxcvbnm123456789123456789', '1234', 'yo', 0, null],
    public: true,
    unique: false,
  },
  lastName: {
    type: 'string',
    valid: ['Pilip', 'Jean', 'claude', 'CAMENBERT', 'trucmuch'],
    invalid: ['a', 'truc_', 'qwertyuiopasdfghjklzxcvbnm123456789123456789', '1234', 'yo', 0, null],
    public: true,
    unique: false,
  },
  password: {
    type: 'string',
    valid: ['Test123*', 'wqupLqxs5#', 'Ttruc20u&', 'Lala123456*', 'chIantIse_1'],
    invalid: ['test', 't1*tei', 'Test', '=/*+-=<', 'test1234<', 0, null],
    public: true,
    unique: false,
  },
  email: {
    type: 'string',
    valid: ['test1@gmail.com', 'example@example.com', 'jean.paul@hotmail.fr', 'GAUTIER@yahoo.fr', 'testament666666@hotmail.com'],
    invalid: ['test', 'test@.com', '@yahoo.fr', '<kamille@gmail.com', '42', 0, null],
    public: true,
    unique: true,
  },
  birthdate: {
    type: 'string',
    valid: ['1900-20-03', '2001-20-03', '1990-20-03', '1980-20-03', '1942-20-03'],
    invalid: ['1899', '2005', 'test', 0, null],
    public: true,
    unique: false,
  },
  bio: {
    type: 'string',
    valid: [' Ceci est un test. ', '       ca aussi  ! '],
    invalid: ['<> $', '`', 0, null],
    public: true,
    unique: false,
  },
  gender: {
    type: 'string',
    valid: ['male', 'female', 'genderqueer'],
    invalid: ['tamereenslip', 'yolo', '42', 'qwertyuiopasdfghjklzxcvbnm123456789123456789', 0, null, false],
    public: true,
    unique: false,
  },
  ageMin: {
    type: 'num',
    valid: ['18', '99'],
    invalid: ['17', '-12', '100', 0, null, false],
    public: true,
    unique: false,
  },
  ageMax: {
    type: 'num',
    valid: ['19', '100'],
    invalid: ['18', '-12', '101', 0, null, false],
    public: true,
    unique: false,
  },
  age: {
    type: 'num',
    valid: ['19', '100'],
    invalid: ['18', '-12', '101', 0, null, false],
    public: true,
    unique: false,
  },
  sexOrient: {
    type: 'string',
    valid: ['Heterosexual', 'Homosexual', 'Bisexual', 'Pansexual'],
    invalid: ['other', 0, null, false],
    public: true,
    unique: false,
  },
  tags: {
    type: 'array of objects',
    valid: [[{ id: 'athlete', text: 'something' }, { id: 'book', text: 'lala' }]],
    invalid: [[0], [null], [false]],
    public: true,
    unique: false,
  },
  localisation: {
    type: 'numstring',
    valid: ['5', '160'],
    invalid: ['4', '161', 0, null, false],
    public: true,
    unique: false,
  },
  photos: {
    type: 'arrayOfString',
    valid: ['https://uinames.com/api/photos/male/1.jpg', 'https://uinames.com/api/photos/female/1.jpg'],
    invalid: ['4', '161', 0, null, false],
    public: true,
    unique: false,
  },
  isAdmin: {
    type: 'string',
    valid: ['true', 'false'],
    invalid: ['a', 'truc_', '42', 'qwertyuiopasdfghjklzxcvbnm123456789123456789', 0, null, false],
    public: false,
    unique: false,
  },
};
