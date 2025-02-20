const asyncHandler = require('express-async-handler');
const Bill = require('../models/billModel');
const Product = require('../models/productModel');

// @desc    Get all bills
// @route   GET /api/bills
// @access  Private
const getBills = asyncHandler(async (req, res) => {
  // Remove user filter to show all bills
  const bills = await Bill.find()
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

  // Find the highest bill number across all users
  const lastBill = await Bill.findOne()
    .sort({ billNumber: -1 })
    .limit(1);

  // Set the new bill number
  const billNumber = lastBill ? lastBill.billNumber + 1 : 1;

  const bill = await Bill.create({
    user: req.user.id,
    billNumber,
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
// @access  Private/Admin
const deleteBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id);

  if (!bill) {
    res.status(404);
    throw new Error('Bill not found');
  }

  // Only allow admins to delete bills
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete bills');
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

  // Remove user check to allow viewing any bill
  res.status(200).json(bill);
});

// @desc    Get product bills and stats
// @route   GET /api/products/:id/bills
// @access  Private
const getProductBills = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  // First verify if product exists
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Get all bills containing this product (remove user filter)
  const bills = await Bill.find({
    'items.product': productId
  })
  .populate('customer', 'name email mobile')
  .populate('items.product', 'name price')
  .sort({ createdAt: -1 });

  // Calculate statistics
  const totalOrders = bills.length;
  const productStats = bills.reduce((acc, bill) => {
    const productItem = bill.items.find(item => item.product._id.toString() === productId);
    if (productItem) {
      acc.totalQuantity += productItem.quantity;
      acc.totalAmount += productItem.subTotal;
    }
    return acc;
  }, { totalQuantity: 0, totalAmount: 0 });

  res.status(200).json({
    product,
    stats: {
      totalOrders,
      ...productStats
    },
    bills: bills.map(bill => ({
      ...bill.toObject(),
      items: bill.items.filter(item => item.product._id.toString() === productId)
    }))
  });
});

module.exports = {
  getBills,
  addBill,
  deleteBill,
  getBill,
  getProductBills
}; 