const express = require('express');
const router = express.Router();
const documentDepartmentController = require('../controllers/documentDepartmentController');

router.get('/', documentDepartmentController.getAssignments);
router.patch('/:id', documentDepartmentController.updateAssignmentStatus);
router.post('/', documentDepartmentController.createAssignment);

module.exports = router;