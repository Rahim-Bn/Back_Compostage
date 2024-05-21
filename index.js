const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const EtudiantRoutes = require("./controllers/EtudiantController");
const EnseignantRoutes = require("./controllers/EnseignantController");
const FeedbackRoutes = require("./routes/feedbackRoutes"); // Corrected import path
const RequestRoutes = require("./routes/requestRoutes");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const port = 3000;
// database connection
const dbURI = "mongodb+srv://Med_Rahim:Ra*28265255@composting.japvp3d.mongodb.net/auth";
mongoose
  .connect(dbURI)
  .then((result) => app.listen(port))
  .catch((err) => console.log(err));

console.log(`Server running on port ${port}`);
// routes
app.use(authRoutes);
app.use('/etudiants', EtudiantRoutes);
app.use('/enseignants', EnseignantRoutes);
app.use('/feedbacks', FeedbackRoutes); // Corrected route path
app.use('/requests',RequestRoutes);