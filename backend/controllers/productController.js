const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

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

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProduct
}; 