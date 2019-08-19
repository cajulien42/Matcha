const debug = require('debug')('app:middleware_error');

module.exports = (err, res) => {
  debug(err);
  res.status(400).json({
    success: false,
    payload: err,
  });
};
