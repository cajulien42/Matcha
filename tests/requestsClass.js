const debug = require('debug')('app:test');
const axios = require('axios');

module.exports = class Request {

  constructor(route, data) {
    this.route = route;
    this.data = data;
  }

  post() {
    return (
      axios.post(`http://localhost:3000${this.route}`, this.data)
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
      axios.get(`http://localhost:3000${this.route}`, { headers: { 'x-auth-token': this.data } })
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

  put() {
    return (
      axios.put(`http://localhost:3000${this.route}`, this.data.user, { headers: { 'x-auth-token': this.data.token } })
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

  delete() {
    return (
      axios.delete(`http://localhost:3000${this.route}`, { headers: { 'x-auth-token': this.data } })
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
