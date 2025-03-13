const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentInfoSchema = new Schema({
  type: {
    type: String,
    enum: ['wastage', 'less', 'collection'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const customerSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  shared: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  mobile: {
    type: String,
    required: [true, 'Please add a mobile number']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  bills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill'
  }],
  totalAmount: {
    type: Number,
    default: 0
  },
  paymentInfo: [paymentInfoSchema],
  remainingAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema); 