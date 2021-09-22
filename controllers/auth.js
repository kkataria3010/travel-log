/* eslint-disable no-underscore-dangle */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validToken = require('../models/ValidToken');
const ValidToken = require('../models/ValidToken');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res, next) => {
  const {
    username, email, password, color,
  } = req.body;
  try {
    const user = await User.create({
      username, email, password, color,
    });
    const accessToken = user.getAccessToken();
    const refreshToken = user.getRefreshToken();
    await ValidToken.create({
      refreshToken,
      userID: user._id,
    });
    res.status(201).json({
      success: true,
      refreshToken,
      accessToken,
    });
  } catch (error) {
    // console.log(error.name);
    next(error);
  }
};
// eslint-disable-next-line consistent-return
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }
    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }
    const accessToken = user.getAccessToken();
    const refreshToken = user.getRefreshToken();
    await ValidToken.create({
      refreshToken,
      userID: user._id,
    });
    res.status(201).json({ success: true, accessToken, refreshToken });
  } catch (error) {
    return next(error);
  }
};

// eslint-disable-next-line consistent-return
exports.forgotpassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse('Email could not be sent', 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;
    const message = `
      <h1>You have requested a passord reset</h1>
      <p>Please go to this link to reset yout password</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        text: message,
      });
      res.status(200).json({ success: true, data: 'Email Sent' });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return next(new ErrorResponse('Email could not send', 500));
    }
  } catch (error) {
    next(error);
  }
};
// eslint-disable-next-line consistent-return
exports.resetpassword = async (req, res, next) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return next(new ErrorResponse('Invalid Reset Token', 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: 'Password Reset Success',
    });
    await ValidToken.deleteMany({ userID: user._id });
  } catch (error) {
    next(error);
  }
};
exports.logout = async (req, res, next) => {
  try {
    await ValidToken.deleteMany({ userID: req.user._id });
  } catch (error) {
    next(error);
  }
};
exports.refresh = async (req, res, next) => {
  const { refreshToken } = req.body;
  try {
    // eslint-disable-next-line no-unused-vars
    const decodeRefreshToken = jwt.verify(refreshToken, process.env.RT_SECRET);
    const user = await User.findById(decodeRefreshToken.id);
    const accessToken = await user.getAccessToken();
    res.status(201).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    if (error.message === 'jwt expired') {
      await validToken.deleteOne({ refreshToken });
    }
    next(error);
  }
};
exports.logout = async (req, res, next) => {
  try {
    await ValidToken.deleteMany({ userID: req.user._id });
    res.status(201).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};
