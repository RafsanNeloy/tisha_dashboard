const asyncHandler = require('express-async-handler');
const Bill = require('../models/billModel');
const Product = require('../models/productModel');
const Customer = require('../models/customerModel');

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
  try {
    console.log('Received bill data:', req.body);
    console.log('User data:', req.user); // Add this to debug user data

    const { customer, items, total, wastageAmount, lessAmount, collectionAmount } = req.body;

    // Validate required fields
    if (!customer || !items || !total) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    // Validate user
    if (!req.user || !req.user._id) {
      res.status(401);
      throw new Error('User not authenticated');
    }

    // Find the highest bill number
    const lastBill = await Bill.findOne().sort({ billNumber: -1 }).limit(1);
    const billNumber = lastBill ? lastBill.billNumber + 1 : 1;

    console.log('Processing items:', items);

    // Get product types
    const itemsWithProductType = await Promise.all(items.map(async (item) => {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product not found: ${item.product}`);
      }
      return {
        ...item,
        product_type: product.product_type
      };
    }));

    // Calculate remaining amount
    const remainingAmount = total - (wastageAmount || 0) - (lessAmount || 0) - (collectionAmount || 0);

    const billData = {
      user: req.user._id, // Use _id instead of id
      billNumber,
      customer,
      items: itemsWithProductType,
      total,
      wastageAmount: wastageAmount || 0,
      lessAmount: lessAmount || 0,
      collectionAmount: collectionAmount || 0,
      remainingAmount
    };

    console.log('Creating bill with data:', billData);

    const bill = await Bill.create(billData);

    const populatedBill = await Bill.findById(bill._id)
      .populate('customer', 'name')
      .populate('items.product', 'name price');

    console.log('Bill created successfully:', populatedBill);
    res.status(201).json(populatedBill);

  } catch (error) {
    console.error('Detailed error in bill creation:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500);
    throw new Error(`Error creating bill: ${error.message}`);
  }
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
    .populate('customer', 'name address')
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

// @desc    Get customer bills and stats
// @route   GET /api/customers/:id/bills
// @access  Private
const getCustomerBills = asyncHandler(async (req, res) => {
  const customerId = req.params.id;

  // First verify if customer exists
  const customer = await Customer.findById(customerId);

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  // Get all bills for this customer
  const bills = await Bill.find({
    customer: customerId
  })
  .select('date billNumber wastageAmount lessAmount total collectionAmount remainingAmount')
  .sort({ date: -1 });

  // Calculate statistics
  const stats = bills.reduce((acc, bill) => {
    acc.totalBillAmount += bill.total;
    acc.totalWastage += bill.wastageAmount;
    acc.totalLess += bill.lessAmount;
    acc.totalCollection += bill.collectionAmount;
    acc.totalRemaining += bill.remainingAmount;
    return acc;
  }, {
    totalBillAmount: 0,
    totalWastage: 0,
    totalLess: 0,
    totalCollection: 0,
    totalRemaining: 0
  });

  res.status(200).json({
    customer,
    stats,
    bills
  });
});

// @desc    Update bill wastage amount
// @route   PUT /api/bills/:billNumber/wastage
// @access  Private
const updateWastage = asyncHandler(async (req, res) => {
  try {
    const { amount } = req.body;
    const billNumber = parseInt(req.params.billNumber); // Convert to number

    // Validate amount
    if (amount === undefined) {
      res.status(400);
      throw new Error('Please provide wastage amount');
    }

    // Find bill by billNumber
    const bill = await Bill.findOne({ billNumber });
    if (!bill) {
      res.status(404);
      throw new Error('Bill not found');
    }

    // Calculate new remaining amount
    const newRemainingAmount = bill.total - amount - bill.lessAmount - bill.collectionAmount;

    // Update bill
    const updatedBill = await Bill.findOneAndUpdate(
      { billNumber },
      {
        wastageAmount: amount,
        remainingAmount: newRemainingAmount
      },
      { new: true }
    ).populate('customer', 'name')
     .populate('items.product', 'name price');

    res.status(200).json(updatedBill);
  } catch (error) {
    console.error('Error updating wastage:', error);
    res.status(500);
    throw new Error(`Error updating wastage: ${error.message}`);
  }
});

// @desc    Update bill less amount
// @route   PUT /api/bills/:billNumber/less
// @access  Private
const updateLess = asyncHandler(async (req, res) => {
  try {
    const { amount } = req.body;
    const billNumber = parseInt(req.params.billNumber);

    if (amount === undefined) {
      res.status(400);
      throw new Error('Please provide less amount');
    }

    const bill = await Bill.findOne({ billNumber });
    if (!bill) {
      res.status(404);
      throw new Error('Bill not found');
    }

    const newRemainingAmount = bill.total - bill.wastageAmount - amount - bill.collectionAmount;

    const updatedBill = await Bill.findOneAndUpdate(
      { billNumber },
      {
        lessAmount: amount,
        remainingAmount: newRemainingAmount
      },
      { new: true }
    ).populate('customer', 'name')
     .populate('items.product', 'name price');

    res.status(200).json(updatedBill);
  } catch (error) {
    console.error('Error updating less amount:', error);
    res.status(500);
    throw new Error(`Error updating less amount: ${error.message}`);
  }
});

// @desc    Update bill collection amount
// @route   PUT /api/bills/:billNumber/collection
// @access  Private
const updateCollection = asyncHandler(async (req, res) => {
  try {
    const { amount } = req.body;
    const billNumber = parseInt(req.params.billNumber);

    if (amount === undefined) {
      res.status(400);
      throw new Error('Please provide collection amount');
    }

    const bill = await Bill.findOne({ billNumber });
    if (!bill) {
      res.status(404);
      throw new Error('Bill not found');
    }

    const newRemainingAmount = bill.total - bill.wastageAmount - bill.lessAmount - amount;

    const updatedBill = await Bill.findOneAndUpdate(
      { billNumber },
      {
        collectionAmount: amount,
        remainingAmount: newRemainingAmount
      },
      { new: true }
    ).populate('customer', 'name')
     .populate('items.product', 'name price');

    res.status(200).json(updatedBill);
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500);
    throw new Error(`Error updating collection: ${error.message}`);
  }
});

module.exports = {
  getBills,
  addBill,
  deleteBill,
  getBill,
  getProductBills,
  getCustomerBills,
  updateWastage,
  updateLess,
  updateCollection
}; 