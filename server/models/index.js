const mongoose = require('mongoose');
const Admin = require('./Admin');
const User = require('./User');

// Define schema for Category
const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  }
}, { timestamps: true });

// Define schema for Brand
const brandSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  }
}, { timestamps: true });

// Define schema for Country
const countrySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  }
}, { timestamps: true });

// Define schema for Varietal
const varietalSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  }
}, { timestamps: true });

// Define schema for Type
const typeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  }
}, { timestamps: true });

// Create models
const Category = mongoose.model('Category', categorySchema);
const Brand = mongoose.model('Brand', brandSchema);
const Country = mongoose.model('Country', countrySchema);
const Varietal = mongoose.model('Varietal', varietalSchema);
const Type = mongoose.model('Type', typeSchema);

// Export models
module.exports = {
  Admin,
  User,
  Category,
  Brand, 
  Country,
  Varietal,
  Type
}; 