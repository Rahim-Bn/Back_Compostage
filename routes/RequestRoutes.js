const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

// Route for submitting a request
router.post('/', requestController.createRequest);

// Route for getting all requests
router.get('/', requestController.getAllRequests);

// Route for deleting a request by ID
router.delete('/:id', requestController.deleteRequest);

module.exports = router;
