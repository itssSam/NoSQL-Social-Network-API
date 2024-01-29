const Thought = require('../models/Thought');
const User = require('../models/User');

const thoughtController = {
    // Get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .then(thoughts => res.json(thoughts))
            .catch(err => res.status(500).json(err));
    },

    // Get a single thought by id
    getThoughtById(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .then(thought => thought ? res.json(thought) : res.status(404).json({ message: 'No thought found with this id!' }))
            .catch(err => res.status(500).json(err));
    },

    // Create a new thought and push to user's thoughts array
    createThought(req, res) {
        Thought.create(req.body)
            .then(thought => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $push: { thoughts: thought._id } },
                    { new: true }
                );
            })
            .then(user => user ? res.json({ message: 'Thought created successfully and added to user!' }) : res.status(404).json({ message: 'No user found with this id!' }))
            .catch(err => res.status(400).json(err));
    },

    // Update a thought by id
    updateThought(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, req.body, { new: true, runValidators: true })
            .then(thought => thought ? res.json(thought) : res.status(404).json({ message: 'No thought found with this id!' }))
            .catch(err => res.status(400).json(err));
    },

    // Delete a thought
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then(thought => thought ? res.json({ message: 'Thought deleted successfully!' }) : res.status(404).json({ message: 'No thought found with this id!' }))
            .catch(err => res.status(500).json(err));
    },

    // Add a reaction to a thought
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $push: { reactions: req.body } },
            { new: true, runValidators: true }
        )
        .then(thought => thought ? res.json(thought) : res.status(404).json({ message: 'No thought found with this id!' }))
        .catch(err => res.status(500).json(err));
    },

    // Remove a reaction from a thought
    removeReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        )
        .then(thought => thought ? res.json(thought) : res.status(404).json({ message: 'No thought or reaction found with this id!' }))
        .catch(err => res.status(500).json(err));
    }
    
};

module.exports = thoughtController;
