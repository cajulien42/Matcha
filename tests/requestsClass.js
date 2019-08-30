const debug = require('debug')('app:test');
const axios = require('axios');

module.exports = class Request {

  constructor(route, auth) {
    this.route = route;
    this.auth = auth;
  }

  authenticate() {
    return (
      axios.post(`http://localhost:3000${this.route}`, this.auth)
        .then((response) => {
          debug('Success: ', response.data.payload);
          return (response.data.payload);
        })
        .catch((error) => {
          debug('Failure:', error.message);
          return (false);
        })
    );
  }

  get() {
    return (
      axios.get(`http://localhost:3000${this.route}`, { headers: { 'x-auth-token': this.auth } })
        .then((response) => {
          debug('Success: ', response.data.payload);
          return (response.data.success);
        })
        .catch((error) => {
          debug('Failure:', error.message);
          return (false);
        })
    );
  }

};
