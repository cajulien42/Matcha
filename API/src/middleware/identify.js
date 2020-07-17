const debug = require('debug')('middleware:identify');

module.exports = (req, res, next) => {
  debug('token:', res.locals.user.username, 'target', res.locals.check);
  if (!(res.locals.user.username === res.locals.check || (res.locals.check2 && res.locals.user.username === res.locals.check2))) {
    debug('Rejected request from:', res.locals.user.username, 'regarding :', res.locals.check);
    return res.status(403).send('Forbidden.');
  }
  return (next());
};
