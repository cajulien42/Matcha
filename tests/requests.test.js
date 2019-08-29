const debug = require('debug')('app:test');
const each = require('jest-each').default;
const req = require('./requests');

test('GET request : /api/users, expect list of users', () => (
  req.then((data) => {
    expect(data).toBeTruthy();
  })
    .catch(err => debug(err))
));
