const jwt = require('jsonwebtoken');
const { Admin, User } = require('../models');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';

// Middleware to authenticate admin users
const authenticateAdmin = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.adminToken;
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get admin from database
    const admin = await Admin.findById(decoded.id);
    
    // Check if admin exists
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid authentication token' });
    }
    
    // Check if admin is active
    if (!admin.isActive) {
      return res.status(403).json({ success: false, message: 'Account is inactive. Please contact support.' });
    }
    
    // Attach admin to request object
    req.admin = admin;
    
    // Proceed to next middleware
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Invalid or expired token. Please log in again.' });
    }
    
    console.error('Authentication error:', error);
    return res.status(500).json({ success: false, message: 'Server error during authentication' });
  }
};

// Middleware to authenticate regular users
const authenticateUser = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.userToken;
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id);
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid authentication token' });
    }
    
    // Attach user to request object
    req.user = user;
    
    // Proceed to next middleware
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Invalid or expired token. Please log in again.' });
    }
    
    console.error('Authentication error:', error);
    return res.status(500).json({ success: false, message: 'Server error during authentication' });
  }
};

module.exports = { 
  authenticateAdmin,
  authenticateUser,
  JWT_SECRET
}; 