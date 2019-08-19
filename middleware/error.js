const debug = require('debug')('app:middleware_error');

module.exports = (err, req, res, next) => {
  debug(err);
  return (
    res.status(400).json({
      success: false,
      payload: err.message,
    }));
};
