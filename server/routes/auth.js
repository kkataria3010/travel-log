const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

const {
  register, login, forgotpassword, resetpassword, refresh, logout,
} = require('../controllers/auth');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/refresh').post(refresh);
router.route('/logout').post(protect, logout);
router.route('/forgotpassword').post(forgotpassword);
router.route('/resetpassword/:resetToken').put(resetpassword);

module.exports = router;
