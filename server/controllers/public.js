/* eslint-disable no-param-reassign */
const LogEntry = require('../models/LogEntry');

exports.getLogEntries = async (req, res, next) => {
  try {
    const logEntries = await LogEntry.find().populate({
      path: 'owner', select: 'username color -_id',
    }).select('-__v -createdAt -updatedAt');

    res.status(201).json({ logEntries });
  } catch (error) {
    next(error);
  }
};
