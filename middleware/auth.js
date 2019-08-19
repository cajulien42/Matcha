const debug = require('debug')('app:middleware_auth');
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    debug('Acces denied. No token provided');
    return res.status(401).send('Acces denied. No token provided');
  }
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    debug('Valid token decoded : ', decoded);
    return (next());
  } catch (ex) {
    debug('Invalid token');
    return (res.status(400).send('Invalid Token.'));
  }
};
