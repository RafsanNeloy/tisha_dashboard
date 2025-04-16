const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const Bill = require('../models/billModel');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = asyncHandler(async (req, res) => {
  // Remove user filter to show all products
  const products = await Product.find();
  res.status(200).json(products);
});

// @desc    Add new product
// @route   POST /api/products
// @access  Private
const addProduct = asyncHandler(async (req, res) => {
  const { name, price, product_type } = req.body;

  if (!name || !price || product_type === undefined) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Validate product_type is either 0 or 1
  if (product_type !== 0 && product_type !== 1) {
    res.status(400);
    throw new Error('Product type must be either 0 (mama) or 1 (motu)');
  }

  const product = await Product.create({
    name,
    price,
    product_type,
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

  // Allow any logged-in user to update products
  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedProduct);
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Only allow admins to delete products
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete products');
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

  // First verify if product exists (removed user filter)
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Get all bills containing this product (removed user filter)
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
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProductBills
}; 