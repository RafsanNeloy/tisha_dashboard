const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    required: [true, 'name is required']
  },
  mobile: {
    type: String,
    required: [true, 'mobile number is required'],
    minlength: [10, 'invalid mobile number'],
    maxlength: [10, 'invalid mobile number']
  },
  address: {
    type: String,
    required: [true, 'address is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema); 