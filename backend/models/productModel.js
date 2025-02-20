const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'Please add a product name']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  product_type: {
    type: Number,
    required: [true, 'Please specify product type'],
    enum: [0, 1], // Only allow 0 (mama) or 1 (motu)
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema); 