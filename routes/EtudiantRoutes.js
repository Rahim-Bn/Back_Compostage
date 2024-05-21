const express = require('express');
const router = express.Router();
const etudiantController = require('./controllers/etudiantController');

// Define routes for etudiant CRUD operations
router.post('/', etudiantController.create);
router.get('/', etudiantController.getAll);
router.get('/unreal', etudiantController.getAll);
router.get('/:id', etudiantController.getById);
router.put('/:id', etudiantController.update);
router.put('/coins',etudiantController.updateCoins);

router.delete('/:id', etudiantController.delete);
module.exports = router;
