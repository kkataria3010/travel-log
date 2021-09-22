const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// eslint-disable-next-line consistent-return
exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // eslint-disable-next-line prefer-destructuring
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorResponse('No user found with this id'), 404);
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.message !== 'jwt expired') {
      return next(new ErrorResponse('Unauthorized Access'), 404);
    }
    return next(error);
  }
};
