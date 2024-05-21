const express = require('express');
const router = express.Router();
const Etudiant = require('../models/etudiant');
const nodemailer = require('nodemailer');

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'Gmail', // e.g., Gmail, Yahoo
  auth: {
    user: 'rahimbennejma50@gmail.com', // your email address
    pass: 'ogud reth eony ztbn' // your email password
  }
});

function generateVerificationToken() {
  // Generate a random token using any method you prefer
  const token = Math.random().toString(36).substring(2, 10); // Example of generating a random string token
  return token;
}

// Update password for an etudiant by email
router.post('/update-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Check if the request contains valid email and newPassword values
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Invalid request body' });
    }

    // Find the etudiant by email
    const etudiant = await Etudiant.findOne({ email });

    // If etudiant not found, return 404
    if (!etudiant) {
      return res.status(404).json({ success: false, message: 'Etudiant not found' });
    }

    // Update the password for the etudiant
    etudiant.password = newPassword;
    await etudiant.save();

    res.json({ success: true, message: 'Password updated successfully', data: etudiant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create etudiant
router.post('/', async (req, res) => {
  try {
    const etudiantData = req.body;

    // Generate a random password
    const randomPassword = generateRandomPassword();

    // Save the random password to the database along with other etudiant data
    const etudiant = new Etudiant({ ...etudiantData, password: randomPassword });
    await etudiant.save();

    // Send email to the new student with their randomly generated password
    const mailOptions = {
      from: 'compostage@gmail.com', // sender email
      to: etudiantData.email, // recipient email
      subject: 'Welcome to our Game!',
      text: `Dear ${etudiantData.prenom} ${etudiantData.nom}, Welcome to our game "Compostage"! Your account has been successfully created with the email address ${etudiantData.email}. Your randomly generated password is: ${randomPassword}\n\nYou can download the game from the following link:\n\nhttp://localhost:3001/homeGame\n\nEnjoy playing the game!\n\nBest regards,\nThe "Compostage" Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).json({ success: true, message: 'Etudiant created successfully', data: etudiant });
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

// Get all emails and passwords (not recommended to expose passwords like this)
// Get all emails, passwords, and coins (not recommended to expose passwords like this)
router.get('/unreal', async (req, res) => {
  try {
    const etudiants = await Etudiant.find({}, 'email password coins');

    // Format the response to include email, password, and coins fields
    const etudiantsFormatted = etudiants.map(etudiant => ({
      email: etudiant.email,
      password: etudiant.password, // Password is not hashed
      coins: etudiant.coins // Include coins field
    }));

    res.json(etudiantsFormatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update coins for an etudiant by email and password
router.post('/coins', async (req, res) => {
  try {
    const { email, password, newCoins } = req.body;

    // Check if the request contains valid email, password, and newCoins values
    if (!email || !password || !newCoins || !Number.isInteger(newCoins)) {
      return res.status(400).json({ success: false, message: 'Invalid request body' });
    }

    // Find the etudiant by email and password
    const etudiant = await Etudiant.findOneAndUpdate(
      { email, password },
      { coins: newCoins },
      { new: true }
    );

    // If etudiant not found, return 404
    if (!etudiant) {
      return res.status(404).json({ success: false, message: 'Etudiant not found' });
    }

    res.json({ success: true, message: 'Coins updated successfully', data: etudiant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/send-verification-email', async (req, res) => {
  try {
    const { email } = req.body;

    // Find the etudiant by email
    const etudiant = await Etudiant.findOne({ email });

    // If etudiant not found, return 404
    if (!etudiant) {
      return res.status(404).json({ success: false, message: 'Etudiant not found' });
    }

    // Generate a verification token
    const verificationToken = generateVerificationToken();

    // Store the verification token in the etudiant document
    etudiant.verificationToken = verificationToken;
    await etudiant.save();

    // Send verification email to the etudiant
    const mailOptions = {
      from: 'compostage@gmail.com',
      to: email,
      subject: 'Password Update Verification',
      html: `
        <p>Dear user,</p>
        <p>Click the button below to confirm the password update:</p>
        <a href="http://localhost:3000/confirm-password-update/${verificationToken}"><button>Confirm Password Update</button></a>
        <p>If you did not request this change, please ignore this email.</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, message: 'Error sending verification email' });
      } else {
        console.log('Verification email sent:', info.response);
        res.status(200).json({ success: true, message: 'Verification email sent successfully' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Confirm password update with verification token
router.post('/confirm-password-update/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Find the etudiant by verification token
    const etudiant = await Etudiant.findOne({ verificationToken: token });

    // If etudiant not found or token is expired, return 404
    if (!etudiant) {
      return res.status(404).json({ success: false, message: 'Invalid or expired verification token' });
    }

    // Update the password for the etudiant
    etudiant.password = newPassword;
    etudiant.verificationToken = undefined; // Clear verification token
    await etudiant.save();

    res.json({ success: true, message: 'Password updated successfully' });
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

router.get('/', async (req, res) => {
  try {
    const etudiants = await Etudiant.find({});
    res.json({ success: true, data: etudiants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update etudiant with specific fields (nom, prenom, email) and preserve other fields
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, email } = req.body;

    // Update only the specified fields
    const etudiant = await Etudiant.findByIdAndUpdate(id, { $set: { nom, prenom, email } }, { new: true });

    if (!etudiant) {
      return res.status(404).json({ success: false, message: "Etudiant not found" });
    }

    res.json({ success: true, message: "Etudiant updated successfully", data: etudiant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Update gouvernorat, argents, and nombre_de_compost for an etudiant by email
router.post('/update-gouvernorat', async (req, res) => {
  try {
    const { email, nom, argents, nombre_de_compost } = req.body;

    // Check if the request contains valid email, nom, argents, and nombre_de_compost values
    if (!email || !nom || argents === undefined || nombre_de_compost === undefined) {
      return res.status(400).json({ success: false, message: 'Invalid request body' });
    }

    // Find the etudiant by email
    let etudiant = await Etudiant.findOne({ email });

    // If etudiant not found, return 404
    if (!etudiant) {
      return res.status(404).json({ success: false, message: 'Etudiant not found' });
    }

    // Ensure that gouvernorat field is an array
    if (!Array.isArray(etudiant.gouvernorat)) {
      etudiant.gouvernorat = []; // Convert to array if it's not already
    }

    // Create a new gouvernorat object
    const newGouvernorat = {
      nom,
      argents,
      nombre_de_compost
    };

    // Add the new gouvernorat to the etudiant's gouvernorat array
    etudiant.gouvernorat.push(newGouvernorat);

    // Save the changes to the etudiant document
    await etudiant.save();

    res.json({ success: true, message: 'Gouvernorat details updated successfully', data: etudiant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;

