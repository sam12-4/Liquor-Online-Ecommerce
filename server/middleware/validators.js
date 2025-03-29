const { body, validationResult } = require('express-validator');

// Custom validation result formatter
const formatValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation error', 
      errors: errors.array().map(err => ({ 
        field: err.path, 
        message: err.msg 
      }))
    });
  }
  next();
};

// Validation middleware for registration
const validateRegistration = [
  // Username validations
  body('username')
    .trim()
    .not().isEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
    .isLength({ max: 30 }).withMessage('Username cannot exceed 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores and hyphens'),
  
  // Email validations
  body('email')
    .trim()
    .not().isEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  // Password validations
  body('password')
    .trim()
    .not().isEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .isLength({ max: 100 }).withMessage('Password cannot exceed 100 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  // Use the common formatter
  formatValidationErrors
];

// Validation middleware for login
const validateLogin = [
  // Username/Email validation
  body('username')
    .trim()
    .not().isEmpty().withMessage('Username or email is required'),
  
  // Password validation
  body('password')
    .trim()
    .not().isEmpty().withMessage('Password is required'),
  
  // Use the common formatter
  formatValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin
}; 