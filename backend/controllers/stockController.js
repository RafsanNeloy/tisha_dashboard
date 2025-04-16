const asyncHandler = require('express-async-handler');
const Stock = require('../models/stockModel');
const Product = require('../models/productModel');

// @desc    Get stock for a product
// @route   GET /api/stock/:productId
// @access  Private
const getProductStock = asyncHandler(async (req, res) => {
  let stock = await Stock.findOne({ product: req.params.productId })
    .populate('product', 'name');

  if (!stock) {
    // Instead of throwing error, create a new stock record with default values
    stock = await Stock.create({
      product: req.params.productId,
      previousStock: 0,
      addedStock: [],
      billedStock: 0
    });
  }

  res.status(200).json(stock);
});

// @desc    Add stock for a product
// @route   POST /api/stock/:productId
// @access  Private
const addStock = asyncHandler(async (req, res) => {
  const { amount, date } = req.body;
  const productId = req.params.productId;

  // Validate product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let stock = await Stock.findOne({ product: productId });

  if (!stock) {
    // Create new stock entry if it doesn't exist
    stock = await Stock.create({
      product: productId,
      previousStock: 0,
      addedStock: [{ date, amount }],
      billedStock: 0
    });
  } else {
    // Add to existing stock
    stock.addedStock.push({ date, amount });
    await stock.save();
  }

  res.status(200).json(stock);
});

// @desc    Update previous stock
// @route   PUT /api/stock/:productId/previous
// @access  Private
const updatePreviousStock = asyncHandler(async (req, res) => {
  const { previousStock } = req.body;
  const productId = req.params.productId;

  let stock = await Stock.findOne({ product: productId });

  if (!stock) {
    stock = await Stock.create({
      product: productId,
      previousStock,
      addedStock: [],
      billedStock: 0
    });
  } else {
    stock.previousStock = previousStock;
    await stock.save();
  }

  res.status(200).json(stock);
});

// @desc    Update billed stock (internal use)
// @route   PUT /api/stock/:productId/billed
// @access  Private
const updateBilledStock = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const productId = req.params.productId;

  let stock = await Stock.findOne({ product: productId });

  if (!stock) {
    res.status(404);
    throw new Error('Stock not found for this product');
  }

  stock.billedStock += Number(amount);
  await stock.save();

  res.status(200).json(stock);
});

module.exports = {
  getProductStock,
  addStock,
  updatePreviousStock,
  updateBilledStock
}; 