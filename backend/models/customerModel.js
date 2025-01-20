const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'Please add a customer name']
  },
  mobile: {
    type: String,
    required: [true, 'Please add a mobile number']
  },
  email: {
    type: String,
    required: [true, 'Please add an email']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema); 