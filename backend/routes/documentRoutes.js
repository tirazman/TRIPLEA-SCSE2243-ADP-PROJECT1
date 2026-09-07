const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

router.post('/', documentController.createDocument);
router.get('/', documentController.getAllDocuments);
router.get('/:refNo', documentController.getDocumentByRef);
router.patch('/:refNo', documentController.updateDocument);

module.exports = router;