const Request = require('../models/request');

// Create request
const createRequest = async (req, res) => {
    try {
        const { nom, prenom, email } = req.body;
        const request = new Request({ nom, prenom, email });
        await request.save();
        res.status(201).json({ success: true, message: 'Request submitted successfully', data: request });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get all requests
const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find({});
        res.json({ success: true, data: requests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Delete request
const deleteRequest = async (req, res) => {
    try {
        const requestId = req.params.id;
        await Request.findByIdAndDelete(requestId);
        res.json({ success: true, message: 'Request deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = { createRequest, getAllRequests, deleteRequest };
