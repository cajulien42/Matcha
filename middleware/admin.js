const debug = require('debug')('app:middleware');

module.exports = (req, res, next) => {
  if(!req.user.isAdmin) {
    debug('Rejected request from :', req.user.username, 'isAdmin : ', req.user.isAdmin);
    return res.status(403).send('Forbidden.');
  } 
  next();
}