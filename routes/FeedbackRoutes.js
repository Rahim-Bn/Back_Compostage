// routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController'); // Corrected import path

// Define routes for feedback CRUD operations
router.post('/', feedbackController.create);
router.get('/', feedbackController.getAll);
router.get('/:id', feedbackController.getById);
router.put('/:id', feedbackController.update);
router.delete('/:id', feedbackController.deleteFeedback); // Corrected function name

module.exports = router;
