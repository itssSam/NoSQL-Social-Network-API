const User = require('../models/User');
const Thought = require('../models/Thought');

const userController = {
    // Get all users
    getAllUsers(req, res) {
        User.find({})
            .then(users => res.json(users))
            .catch(err => res.status(500).json(err));
    },

    // Get a single user by id
    getUserById(req, res) {
        User.findOne({ _id: req.params.userId })
            .populate('thoughts')
            .populate('friends')
            .then(user => user ? res.json(user) : res.status(404).json({ message: 'No user found with this id!' }))
            .catch(err => res.status(500).json(err));
    },

    // Create a new user
    createUser(req, res) {
        User.create(req.body)
            .then(user => res.json(user))
            .catch(err => res.status(400).json(err));
    },

    // Update a user by id
    updateUser(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true, runValidators: true })
            .then(user => user ? res.json(user) : res.status(404).json({ message: 'No user found with this id!' }))
            .catch(err => res.status(400).json(err));
    },

    // Delete a user and their thoughts
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: 'No user found with this id!' });
                }
                // BONUS: Remove a user's thoughts when the user is deleted
                return Thought.deleteMany({ _id: { $in: user.thoughts } });
            })
            .then(() => res.json({ message: 'User and their thoughts deleted!' }))
            .catch(err => res.status(500).json(err));
    },

    // Add a friend to a user's friend list
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { new: true }
        )
        .then(user => user ? res.json(user) : res.status(404).json({ message: 'No user found with this id!' }))
        .catch(err => res.status(500).json(err));
    },

    // Remove a friend from a user's friend list
    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true }
        )
        .then(user => user ? res.json(user) : res.status(404).json({ message: 'No user found with this id!' }))
        .catch(err => res.status(500).json(err));
    }
};

module.exports = userController;
