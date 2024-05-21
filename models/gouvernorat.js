const mongoose = require('mongoose');

const gouvernoratSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: true
  },
  argents: {
    type: Number,
    default: 0
  },
  nombre_de_compost: {
    type: Number,
    default: 0
  }
});

// Define the 24 gouvernorats
const gouvernoratsList = [
  { nom: 'Tunis', argents: 0, nombre_de_compost: 0 },
  { nom: 'Ariana', argents: 0, nombre_de_compost: 0 },
  { nom: 'Ben Arous', argents: 0, nombre_de_compost: 0 },
  { nom: 'Manouba', argents: 0, nombre_de_compost: 0 },
  { nom: 'Nabeul', argents: 0, nombre_de_compost: 0 },
  { nom: 'Zaghouan', argents: 0, nombre_de_compost: 0 },
  { nom: 'Bizerte', argents: 0, nombre_de_compost: 0 },
  { nom: 'Béja', argents: 0, nombre_de_compost: 0 },
  { nom: 'Jendouba', argents: 0, nombre_de_compost: 0 },
  { nom:  'Kef', argents: 0, nombre_de_compost: 0 },
  { nom: 'Siliana', argents: 0, nombre_de_compost: 0 },
  { nom: 'Kairouan', argents: 0, nombre_de_compost: 0 },
  { nom: 'Kasserine', argents: 0, nombre_de_compost: 0 },
  { nom: 'Sidi Bouzid', argents: 0, nombre_de_compost: 0 },
  { nom: 'Sousse', argents: 0, nombre_de_compost: 0 },
  { nom: 'Mahdia', argents: 0, nombre_de_compost: 0 },
  { nom: 'Monastir', argents: 0, nombre_de_compost: 0 },
  { nom: 'Gabès', argents: 0, nombre_de_compost: 0 },
  { nom: 'Médenine', argents: 0, nombre_de_compost: 0 },
  { nom: 'Tataouine', argents: 0, nombre_de_compost: 0 },
  { nom: 'Tozeur', argents: 0, nombre_de_compost: 0 },
  { nom: 'Kebili', argents: 0, nombre_de_compost: 0 },
  { nom: 'Gafsa', argents: 0, nombre_de_compost: 0 },
  { nom: 'Seliana', argents: 0, nombre_de_compost: 0 },

];

// Add the gouvernorats to the model
gouvernoratSchema.statics.initializeGouvernorats = async function () {
  try {
    await this.deleteMany({});
    await this.insertMany(gouvernoratsList);
    console.log('Gouvernorats initialized successfully');
  } catch (error) {
    console.error('Error initializing gouvernorats:', error);
  }
};

module.exports = mongoose.model('Gouvernorat', gouvernoratSchema);
