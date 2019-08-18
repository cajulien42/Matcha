const debug = require('debug')('app:debug');

module.exports = (req, res, next) => {
  if(req.user.username !== req.params.username) {
    debug(req.user.username, req.params.username);
    return res.status(403).send('Forbidden.')
  } 
  next();
}