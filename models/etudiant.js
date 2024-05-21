const mongoose = require('mongoose');

const etudiantSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gouvernorat: [{
        nom: {
            type: String,
            default: ' '
        },
        argents: {
            type: Number,
            default: 0
        },
        nombre_de_compost: {
            type: Number,
            default: 0
        }
    }]
})
module.exports = mongoose.model('Etudiant', etudiantSchema);
