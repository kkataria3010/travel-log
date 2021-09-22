const mongoose = require('mongoose');

const { Schema } = mongoose;
const requiredString = {
  type: String,
  required: true,
};
const requiredNumber = {
  type: Number,
  required: true,
};
const LogEntrySchema = new Schema({
  title: requiredString,
  comments: String,
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },
  latitude: {
    ...requiredNumber,
    min: -90,
    max: 90,
  },
  longitude: {
    ...requiredNumber,
    min: -180,
    max: 180,
  },
  visitDate: {
    required: true,
    type: Date,
  },
  image: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});
const LogEntry = mongoose.model('LogEntry', LogEntrySchema);
module.exports = LogEntry;
