const asyncHandler = require('express-async-handler');
const Customer = require('../models/customerModel');
const Bill = require('../models/billModel');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find({ user: req.user.id });
  res.status(200).json(customers);
});

// @desc    Add new customer
// @route   POST /api/customers
// @access  Private
const addCustomer = asyncHandler(async (req, res) => {
  const { name, mobile, email } = req.body;

  if (!name || !mobile || !email) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const customer = await Customer.create({
    name,
    mobile,
    email,
    user: req.user.id
  });

  res.status(201).json(customer);
});

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  // Check for user
  if (customer.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedCustomer);
});

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  // Check for user
  if (customer.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await customer.deleteOne();

  res.status(200).json(customer);
});

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
const getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  // Check for user
  if (customer.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  res.status(200).json(customer);
});

// @desc    Get customer bills and stats
// @route   GET /api/customers/:id/bills
// @access  Private
const getCustomerBills = asyncHandler(async (req, res) => {
  const customerId = req.params.id;

  // First verify if customer exists and belongs to user
  const customer = await Customer.findOne({
    _id: customerId,
    user: req.user.id
  });

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  // Get all bills for this customer
  const bills = await Bill.find({
    customer: customerId,
    user: req.user.id
  })
  .populate('items.product', 'name price')
  .sort({ createdAt: -1 });

  // Calculate statistics
  const totalOrders = bills.length;
  const totalAmount = bills.reduce((sum, bill) => sum + bill.total, 0);

  res.status(200).json({
    customer,
    stats: {
      totalOrders,
      totalAmount
    },
    bills
  });
});

module.exports = {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomer,
  getCustomerBills
}; 