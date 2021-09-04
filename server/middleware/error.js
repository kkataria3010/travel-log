const ErrorResponse = require('../utils/errorResponse');
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  if (err.code === 11000) {
    const message = req.url === '/api/auth/register' ? 'Email Already Registered' : 'Duplicate Field Value Enter';
    error = new ErrorResponse(message, 400);
  }
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};
module.exports = errorHandler;
