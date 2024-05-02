// controllers/feedbackController.js
const Feedback = require('../models/feedback');

// Create feedback
const create = async (req, res) => {
    try {
        const { email, message } = req.body;
        const feedback = new Feedback({ email, message });
        await feedback.save();
        res.status(201).json({ success: true, message: 'Feedback submitted successfully', data: feedback });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get all feedback
const getAll = async (req, res) => {
    try {
        const feedback = await Feedback.find({});
        res.json({ success: true, data: feedback });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get feedback by ID
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }
        res.json({ success: true, data: feedback });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Update feedback
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFeedback = req.body;
        const feedback = await Feedback.findByIdAndUpdate(id, updatedFeedback, { new: true });
        if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }
        res.json({ success: true, message: 'Feedback updated successfully', data: feedback });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Delete feedback
const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findByIdAndDelete(id);
        if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }
        res.json({ success: true, message: 'Feedback deleted successfully', data: feedback });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = { create, getAll, getById, update, deleteFeedback };
