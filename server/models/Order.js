const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  salePrice: {
    type: Number,
    default: null
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: String,
  category: String,
  type: String,
  brand: String,
  size: String,
  abv: String
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    default: () => `ORD-${uuidv4().substring(0, 8).toUpperCase()}`
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.userType === 'registered';
    }
  },
  userType: {
    type: String,
    enum: ['registered', 'guest'],
    required: true
  },
  userNotificationSeen: {
    type: Boolean,
    default: false
  },
  adminNotificationSeen: {
    type: Boolean,
    default: false
  },
  customerInfo: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: String,
    address: {
      street: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      zipCode: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true,
        default: 'United States'
      }
    }
  },
  items: [orderItemSchema],
  shippingMethod: {
    type: String,
    required: true
  },
  shippingCost: {
    type: Number,
    required: true,
    default: 0
  },
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending to be confirmed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending to be confirmed'
  },
  statusHistory: [{
    status: String,
    date: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  notes: String
});

// Add status change to history
orderSchema.pre('save', function(next) {
  // If the document is new, add the initial status to history
  if (this.isNew) {
    this.statusHistory.push({
      status: this.status,
      date: new Date(),
      note: 'Order created'
    });
  } else if (this.isModified('status')) {
    // If status was changed, add to history
    this.statusHistory.push({
      status: this.status,
      date: new Date()
    });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema); 