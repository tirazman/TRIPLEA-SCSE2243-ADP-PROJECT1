const express = require('express');
const router = express.Router();
const compileReportController = require('../controllers/compileReportController');

router.post('/', compileReportController.createCompileReport);
router.get('/:refNo', compileReportController.getCompileReportByRef);

module.exports = router;