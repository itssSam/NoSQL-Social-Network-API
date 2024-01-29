const mongoose = require('mongoose');
const User = require('./models/User'); // Make sure this path is correct
const Thought = require('./models/Thought'); // Make sure this path is correct

// Updated connection string without the deprecated options
mongoose.connect('mongodb://localhost:27017/socialNetworkDB');

const seedUsers = [
  { username: 'johndoe', email: 'johndoe@example.com' },
  { username: 'janedoe', email: 'janedoe@example.com' }
];

const seedThoughts = [
  { thoughtText: 'This is a thought by John.', username: 'johndoe' },
  { thoughtText: 'This is a thought by Jane.', username: 'janedoe' }
];

const seedDB = async () => {
  await User.deleteMany({});
  await Thought.deleteMany({});
  
  for (let userData of seedUsers) {
    let user = new User(userData);
    await user.save();
  }

  for (let thoughtData of seedThoughts) {
    let user = await User.findOne({ username: thoughtData.username });
    let thought = new Thought({ ...thoughtData, userId: user._id });
    await thought.save();
    user.thoughts.push(thought);
    await user.save();
  }
};

seedDB().then(() => {
    console.log('Database seeded successfully!');
    mongoose.connection.close();
  }).catch(err => {
    console.error('An error occurred while seeding the database:', err);
    mongoose.connection.close();
  });
  
