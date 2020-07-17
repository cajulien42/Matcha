module.exports = {
  id: {
    type: 'string',
    valid: ['sometag', 'Jean', 'claude', 'usertest', 'test'],
    invalid: ['a', 'truc_', 'qwertyuiopasdfghjklzxcvbnm123456789123456789', '123', 'yol', 0, null],
    public: true,
    unique: true,
  },
  text: {
    type: 'string',
    valid: ['Pilip', 'Jean', 'claude', 'CAMENBERT', 'trucmuch'],
    invalid: ['a', 'truc_', 'qwertyuiopasdfghjklzxcvbnm123456789123456789', '1234', 'yo', 0, null],
    public: true,
    unique: false,
  },
};
