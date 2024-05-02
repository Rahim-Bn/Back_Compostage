// controllers/enseignantController.js
const express = require('express');
const router = express.Router();
const Enseignant = require('../models/enseignant');

// Create enseignant
router.post('/', async (req, res) => {
  try {
    const enseignantData = req.body;
    const enseignant = new Enseignant(enseignantData);
    await enseignant.save();
    res.status(201).json({ success: true, message: 'Enseignant created successfully', data: enseignant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const enseignant = await Enseignant.findOne({ email });

    if (!enseignant || enseignant.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    res.json({ success: true, message: "Enseignant signed in successfully", data: enseignant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


// Delete enseignant
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const enseignant = await Enseignant.findByIdAndDelete(id);
    if (!enseignant) {
      return res.status(404).json({ success: false, message: "Enseignant not found" });
    }
    res.json({ success: true, message: "Enseignant deleted successfully", data: enseignant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Get all enseignants
router.get('/', async (req, res) => {
  try {
    const enseignants = await Enseignant.find({});
    res.json({ success: true, data: enseignants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get enseignant by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const enseignant = await Enseignant.findById(id);
    if (!enseignant) {
      return res.status(404).json({ success: false, message: 'Enseignant not found' });
    }
    res.json({ success: true, data: enseignant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update enseignant
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const enseignant = await Enseignant.findByIdAndUpdate(id, req.body, { new: true });
    if (!enseignant) {
      return res.status(404).json({ success: false, message: "Enseignant not found" });
    }
    res.json({ success: true, message: "Enseignant updated successfully", data: enseignant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
