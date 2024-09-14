const express = require('express');
const router = express.Router();
const documentController = require('../controller/documentController');

console.log("inside routes")

// Route to get the document by ID
router.get('/:documentId', documentController.getOrCreateDocument);

// Route to create a new document
// router.post('/:documentId', documentController.createDocument);

// Route to update a document
router.put('/:documentId', documentController.updateDocument);

// Route to update a document
router.put('/:documentId', documentController.deleteDocument);

module.exports = router;
