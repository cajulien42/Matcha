const debug = require('debug')('middleware:wrapper');

module.exports = function asyncMiddleware(route) {
  return async (req, res, next) => (
    route(req, res)
      .catch((err) => {
        debug(err);
        next(err);
      })
  );
};
