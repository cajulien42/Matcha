const debug = require('debug')('middleware:admin');

module.exports = (req, res, next) => {
  if (!res.locals.user.isAdmin) {
    debug('Rejected request from :', res.locals.user.username, 'isAdmin : ', res.locals.user.isAdmin);
    return res.status(403).send('Forbidden.');
  }
  return (next());
};
