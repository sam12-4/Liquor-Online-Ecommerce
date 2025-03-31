const mongoose = require('mongoose');

const adminNotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['order_placed', 'order_status_change', 'out_of_stock', 'low_stock'],
    required: true
  },
  orderId: {
    type: String,
    required: true
  },
  productId: {
    type: String,
    required: false
  },
  orderStatus: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for faster queries
adminNotificationSchema.index({ read: 1 });
adminNotificationSchema.index({ createdAt: -1 });

const AdminNotification = mongoose.model('AdminNotification', adminNotificationSchema);

module.exports = AdminNotification; 