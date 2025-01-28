const asyncHandler = require('express-async-handler');
const Bill = require('../models/billModel');

// @desc    Get all bills
// @route   GET /api/bills
// @access  Private
const getBills = asyncHandler(async (req, res) => {
  const bills = await Bill.find({ user: req.user.id })
    .populate('customer', 'name')
    .populate('items.product', 'name price');
  res.status(200).json(bills);
});

// @desc    Add new bill
// @route   POST /api/bills
// @access  Private
const addBill = asyncHandler(async (req, res) => {
  const { customer, items, total } = req.body;

  if (!customer || !items || !total) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const bill = await Bill.create({
    user: req.user.id,
    customer,
    items,
    total
  });

  const populatedBill = await Bill.findById(bill._id)
    .populate('customer', 'name')
    .populate('items.product', 'name price');

  res.status(201).json(populatedBill);
});

// @desc    Delete bill
// @route   DELETE /api/bills/:id
// @access  Private
const deleteBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id);

  if (!bill) {
    res.status(404);
    throw new Error('Bill not found');
  }

  // Check for user
  if (bill.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await bill.deleteOne();

  res.status(200).json(bill);
});

// @desc    Get single bill
// @route   GET /api/bills/:id
// @access  Private
const getBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id)
    .populate('customer', 'name')
    .populate('items.product', 'name price');

  if (!bill) {
    res.status(404);
    throw new Error('Bill not found');
  }

  // Check for user
  if (bill.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  res.status(200).json(bill);
});

module.exports = {
  getBills,
  addBill,
  deleteBill,
  getBill
}; 