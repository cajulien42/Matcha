const debug = require('debug')('app:middleware_handler');

module.exports = function asyncMiddleware(route) {
  return async (req, res, next) => (
    route(req, res)
      .catch((err) => {
        debug('here1', err);
        next(err);
      })
  );
};
