module.exports = function asyncMiddleware(route) {
  return async (req, res, next) => {
    route(req, res)
      .catch(err => next(err.message));
  };
};
