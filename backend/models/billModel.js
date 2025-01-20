const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Customer'
  },
  date: {
    type: Date,
    default: Date.now
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    subTotal: {
      type: Number,
      required: true
    }
  }],
  total: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Bill', billSchema); 