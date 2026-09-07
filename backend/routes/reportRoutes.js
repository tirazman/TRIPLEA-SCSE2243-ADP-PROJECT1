const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.post('/', reportController.createReport);
router.get('/', reportController.getReports);
router.patch('/:reportID', reportController.updateReport);

module.exports = router;