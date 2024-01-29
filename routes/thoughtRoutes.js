const express = require('express');
const router = express.Router();
const Thought = require('../models/Thought'); // Adjust with your actual Thought model path

// GET all thoughts
router.get('/', async (req, res) => {
    try {
        const thoughts = await Thought.find({});
        res.json(thoughts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single thought by _id
router.get('/:thoughtId', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.thoughtId);
        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thought);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new thought
router.post('/', async (req, res) => {
    const thought = new Thought(req.body);
    try {
        const newThought = await thought.save();
        res.status(201).json(newThought);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT to update a thought by _id
router.put('/:thoughtId', async (req, res) => {
    try {
        const updatedThought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true });
        if (!updatedThought) {
            return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(updatedThought);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a thought by _id
router.delete('/:thoughtId', async (req, res) => {
    try {
        const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }
        res.json({ message: 'Thought deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
