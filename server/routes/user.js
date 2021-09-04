const express = require('express');

const router = express.Router();
const { getLogEntries, addLogEntry, deleteLogEntry } = require('../controllers/user');
const { protect } = require('../middleware/auth');

router.route('/getLogEntries').get(protect, getLogEntries);
router.route('/addLogEntry').post(protect, addLogEntry);
router.route('/deleteLogEntry').post(protect, deleteLogEntry);
module.exports = router;
