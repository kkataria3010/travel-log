const express = require('express');

const router = express.Router();
const { getLogEntries } = require('../controllers/public');

router.route('/getLogEntries').get(getLogEntries);

module.exports = router;
