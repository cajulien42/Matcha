const debug = require('debug')('app:test');
const axios = require('axios');


module.exports = axios.get('http://localhost:3000/api/users')
  .then((response) => {
    debug('Success: ', response.data.payload.users);
    return (response.data.success);
  })
  .catch((error) => {
    debug('Failure:', error);
    return (false);
  });
