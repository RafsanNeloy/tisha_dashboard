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
    unique: true
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
    select: true
  },
  discountPercentage: {
    type: Number,
    default: 0,
    select: true
  },
  discountAmount: {
    type: Number,
    default: 0,
    select: true
  },
  total: {
    type: Number,
    required: true
  },
  paid: {
    type: Number,
    default: 0
  },
  due: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Add a pre-save middleware to ensure numbers are properly converted
billSchema.pre('save', function(next) {
  if (this.discountPercentage) {
    this.discountPercentage = Number(this.discountPercentage);
  }
  if (this.discountAmount) {
    this.discountAmount = Number(this.discountAmount);
  }
  if (this.additionalPrice) {
    this.additionalPrice = Number(this.additionalPrice);
  }
  next();
});

// Ensure these fields are always included in the response
billSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    ret.additionalPrice = doc.additionalPrice || 0;
    ret.discountPercentage = doc.discountPercentage || 0;
    ret.discountAmount = doc.discountAmount || 0;
    return ret;
  }
});

module.exports = mongoose.model('Bill', billSchema); 