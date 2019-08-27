const debug = require('debug')('app:test');
const axios = require('axios');


module.exports = axios.get('http://localhost:3000/api/user/Bob')
  .then((response) => {
    debug('Success: ', response.data.payload.users);
    return (response.data.success);
  })
  .catch((error) => {
    debug('Failure:', error);
    return (false);
  });
