
const requestIp = require('request-ip');

// inside middleware handler
module.exports = (req, res, next) => {
  const clientIp = requestIp.getClientIp(req);
  return next();
};
