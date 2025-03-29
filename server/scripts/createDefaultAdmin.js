const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const connectDB = require('../config/db');

// Admin details
const defaultAdmin = {
  username: 'admin',
  email: 'admin@example.com',
  password: 'admin',
  isActive: true
};

// Connect to the database and create admin
async function createDefaultAdmin() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      $or: [
        { username: defaultAdmin.username },
        { email: defaultAdmin.email }
      ]
    });

    if (existingAdmin) {
      console.log('Admin already exists. Skipping creation.');
      // Note: For security, we won't update password automatically if admin exists
    } else {
      // Create new admin user
      const newAdmin = new Admin(defaultAdmin);
      await newAdmin.save();
      console.log('Default admin user created successfully!');
      console.log(`Username: ${defaultAdmin.username}`);
      console.log(`Email: ${defaultAdmin.email}`);
      console.log(`Password: ${defaultAdmin.password}`);
      console.log('IMPORTANT: For security, please change the default password in production.');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Disconnect
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
createDefaultAdmin(); 