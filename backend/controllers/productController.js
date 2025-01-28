const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const Bill = require('../models/billModel');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user.id });
  res.status(200).json(products);
});

// @desc    Add new product
// @route   POST /api/products
// @access  Private
const addProduct = asyncHandler(async (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const product = await Product.create({
    name,
    price,
    user: req.user.id
  });

  res.status(201).json(product);
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check for user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedProduct);
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check for user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await product.deleteOne();

  res.status(200).json(product);
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check for user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  res.status(200).json(product);
});

// @desc    Get product bills and stats
// @route   GET /api/products/:id/bills
// @access  Private
const getProductBills = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  // First verify if product exists and belongs to user
  const product = await Product.findOne({
    _id: productId,
    user: req.user.id
  });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Get all bills containing this product
  const bills = await Bill.find({
    user: req.user.id,
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
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProductBills
}; 