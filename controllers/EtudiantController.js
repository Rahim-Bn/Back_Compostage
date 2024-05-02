const express = require('express');
const router = express.Router();
const Etudiant = require('../models/etudiant');

// Create etudiant
router.post('/', async (req, res) => {
  try {
    const etudiantData = req.body;
    const etudiant = new Etudiant(etudiantData);
    await etudiant.save();
    res.status(201).json({ success: true, message: 'Etudiant created successfully', data: etudiant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete etudiant
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const etudiant = await Etudiant.findByIdAndDelete(id);
    if (!etudiant) {
      return res.status(404).json({ success: false, message: "Etudiant not found" });
    }
    res.json({ success: true, message: "Etudiant deleted successfully", data: etudiant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Get all etudiants
router.get('/', async (req, res) => {
  try {
    const etudiants = await Etudiant.find({});
    res.json({ success: true, data: etudiants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
router.get('/unreal', async (req, res) => {
  try {
    const etudiants = await Etudiant.find({});
    res.json(etudiants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
// Get etudiant by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const etudiant = await Etudiant.findById(id);
    if (!etudiant) {
      return res.status(404).json({ success: false, message: 'Etudiant not found' });
    }
    res.json({ success: true, data: etudiant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update etudiant
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const etudiant = await Etudiant.findByIdAndUpdate(id, req.body, { new: true });
    if (!etudiant) {
      return res.status(404).json({ success: false, message: "Etudiant not found" });
    }
    res.json({ success: true, message: "Etudiant updated successfully", data: etudiant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
