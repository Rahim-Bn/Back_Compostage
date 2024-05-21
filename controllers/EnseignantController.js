// controllers/enseignantController.js
const express = require('express');
const router = express.Router();
const Enseignant = require('../models/enseignant');
const nodemailer = require('nodemailer');

// Create enseignant
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Using Gmail SMTP service
  auth: {
    user: 'rahimbennejma50@gmail.com', // Your Gmail email address
    pass: 'ogud reth eony ztbn' // Your Gmail password
  }
});

// Create enseignant
router.post('/', async (req, res) => {
  try {
    const enseignantData = req.body;

    // Generate a random password
    const randomPassword = generateRandomPassword();

    // Save the random password to the database along with other enseignant data
    const enseignant = new Enseignant({ ...enseignantData, password: randomPassword });
    await enseignant.save();

    // Send email to the new enseignant with their randomly generated password
    const mailOptions = {
      from: 'compostage@gmail.com', // Your Gmail email address
      to: enseignantData.email, // Recipient's email address
      subject: 'Welcome to our platform!',
      text: `Dear ${enseignantData.prenom} ${enseignantData.nom}, Welcome to our platform! Your account has been successfully created with the email address ${enseignantData.email}. Your randomly generated password is: ${randomPassword}, Now you can signIn and supervise our students `
    
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).json({ success: true, message: 'Enseignant created successfully', data: enseignant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Function to generate a random password
function generateRandomPassword() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return password;
}
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
