const mongoose = require('mongoose');

const discountCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  type: {
    type: String,
    required: true,
    enum: ['discount', 'referral'],
    default: 'discount'
  },
  description: {
    type: String,
    required: true
  },
  discountType: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  maxUses: {
    type: Number,
    default: null // null means unlimited
  },
  currentUses: {
    type: Number,
    default: 0
  },
  minPurchaseAmount: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null // null means no expiration
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for faster queries
discountCodeSchema.index({ code: 1 });
discountCodeSchema.index({ isActive: 1 });
discountCodeSchema.index({ startDate: 1, endDate: 1 });

// Pre-save hook to update the updatedAt field
discountCodeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to check if code is valid
discountCodeSchema.methods.isValid = function() {
  const now = new Date();
  
  // Check if code is active
  if (!this.isActive) return false;
  
  // Check if code has reached max uses
  if (this.maxUses !== null && this.currentUses >= this.maxUses) return false;
  
  // Check if code is within date range
  if (this.startDate && now < this.startDate) return false;
  if (this.endDate && now > this.endDate) return false;
  
  return true;
};

module.exports = mongoose.model('DiscountCode', discountCodeSchema); 