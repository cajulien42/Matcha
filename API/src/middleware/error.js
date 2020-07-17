const debug = require('debug')('middleware:error');

module.exports = (err, req, res, next) => {
  debug(err);
  return (
    res.status(200).json({
      success: false,
      payload: err.message,
    }));
};
