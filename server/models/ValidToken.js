const mongoose = require('mongoose');

const validTokenSchema = new mongoose.Schema({
  refreshToken: String,
  userID: String,
});
const validToken = mongoose.model('validToken', validTokenSchema);

module.exports = validToken;
