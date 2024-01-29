const express = require('express');
const mongoose = require('mongoose');


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/socialNetworkDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));;

// Initialize Express App
const app = express();

// Middleware
app.use(express.json());

// Import Route Handlers (Assuming you have separate files for these)
const userRoutes = require('./routes/userRoutes');
const thoughtRoutes = require('./routes/thoughtRoutes');

// Routes
app.use('/api/users', userRoutes);
app.use('/api/thoughts', thoughtRoutes);

// Handling Undefined Routes
app.use((req, res, next) => {
  res.status(404).send('Sorry, that route does not exist.');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
