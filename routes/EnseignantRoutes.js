// routes/enseignantRoutes.js
const express = require('express');
const router = express.Router();
const enseignantController = require('./controllers/enseignantController');

// Define routes for enseignant CRUD operations
router.post('/', enseignantController.create);
router.get('/', enseignantController.getAll);
router.get('/:id', enseignantController.getById);
router.put('/:id', enseignantController.update);
router.delete('/:id', enseignantController.delete);

module.exports = router;
