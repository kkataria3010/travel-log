/* eslint-disable no-underscore-dangle */
const LogEntry = require('../models/LogEntry');
const ErrorResponse = require('../utils/errorResponse');

exports.getLogEntries = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const logEntries = await LogEntry.find().populate({
      path: 'owner', select: 'username color _id',
    }).select(' -__v -createdAt -updatedAt').lean();
    for (let i = 0; i < logEntries.length; i += 1) {
      logEntries[i].isOwner = String(logEntries[i].owner._id) === String(userId);
      // console.log(String(logEntries[i].owner._id), String(userId));
    }
    res.status(201).json({ logEntries });
  } catch (error) {
    next(error);
  }
};
exports.addLogEntry = async (req, res, next) => {
  try {
    const logEntry = new LogEntry(req.body);
    logEntry.owner = req.user._id;
    const createdEntry = await logEntry.save();
    const created = createdEntry.toJSON();
    created.isOwner = true;
    created.owner = {
      username: req.user.username,
      color: req.user.color,
    };
    res.status(200).json(created);
  } catch (error) {
    next(error);
  }
};
// eslint-disable-next-line consistent-return
exports.deleteLogEntry = async (req, res, next) => {
  try {
    const logEntry = await LogEntry.findOneAndDelete({
      _id: req.body.logId,
      owner: req.user._id,
    });
    // console.log("");
    if (logEntry) {
      res.status(200).json({
        success: true,
        logId: req.body.logId,
      });
    } else return next(new ErrorResponse('Unable to Delete', 401));
  } catch (error) {
    next(error);
  }
};
