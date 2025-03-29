const mongoose = require('mongoose');
const { User } = require('../models');
require('dotenv').config();

// MongoDB connection string
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liquor-online';

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

// Default user details
const defaultUser = {
  username: 'user',
  email: 'user@example.com',
  password: 'password123'
};

// Create default user
const createDefaultUser = async () => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { username: defaultUser.username },
        { email: defaultUser.email }
      ]
    });

    if (existingUser) {
      console.log('Default user already exists');
      mongoose.disconnect();
      return;
    }

    // Create new user
    const user = new User(defaultUser);
    await user.save();

    console.log('Default user created successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating default user:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Run the function
createDefaultUser(); 