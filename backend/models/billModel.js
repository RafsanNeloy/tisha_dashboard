const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  billNumber: {
    type: Number,
    required: true,
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
    product_type: {
      type: Number,
      required: true,
      enum: [0, 1] // 0 for ডজন (dozen), 1 for পিস (piece)
    },
    subTotal: {
      type: Number,
      required: true
    }
  }],
  additionalPrice: {
    type: Number,
    default: 0,
    required: false
  },
  total: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

billSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    ret.additionalPrice = ret.additionalPrice || 0;
    return ret;
  }
});

module.exports = mongoose.model('Bill', billSchema); 