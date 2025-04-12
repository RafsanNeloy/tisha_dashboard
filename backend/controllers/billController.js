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
    const { customer, items, total, additionalPrice = 0 } = req.body;

    console.log('Bill Creation Request:', {
      customerId: customer,
      total,
      items: items.length,
      additionalPrice
    });

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

    // Calculate subtotals and total
    let totalBill = 0;
    const processedItems = itemsWithProductType.map(item => {
      const subTotal = item.quantity * item.price;
      totalBill += subTotal;
      return {
        ...item,
        subTotal
      };
    });
    
    // Add the additional price to the total
    totalBill += Number(additionalPrice);

    // Create bill with explicit setting of additionalPrice
    const billData = {
      user: req.user._id,
      billNumber,
      customer,
      items: processedItems,
      additionalPrice: Number(additionalPrice || 0),
      total: totalBill
    };

    console.log('Creating bill with data:', billData);

    const bill = await Bill.create(billData);

    // Update customer's total amount and bills
    const customerToUpdate = await Customer.findById(customer);
    if (!customerToUpdate) {
      res.status(404);
      throw new Error('Customer not found');
    }

    console.log('Before Update:', {
      currentTotalAmount: customerToUpdate.totalAmount,
      currentRemainingAmount: customerToUpdate.remainingAmount
    });

    // Add bill to customer's bills array
    customerToUpdate.bills.push(bill._id);
    
    // Calculate new remaining amount
    const allBills = await Bill.find({ customer: customerToUpdate._id });
    const previousAmount = customerToUpdate.previousAmount || 0;
    const totalBillAmount = allBills.reduce((sum, b) => sum + (b.total || 0), 0) + totalBill;
    
    // Calculate totals from all payments
    const payments = customerToUpdate.paymentInfo || [];
    const totalCollection = payments.reduce((sum, payment) => 
      payment.type === 'collection' ? sum + payment.amount : sum, 0);
    const totalWastage = payments.reduce((sum, payment) => 
      payment.type === 'wastage' ? sum + payment.amount : sum, 0);
    const totalLess = payments.reduce((sum, payment) => 
      payment.type === 'less' ? sum + payment.amount : sum, 0);

    // Update total and remaining amounts
    customerToUpdate.totalAmount = totalBillAmount;
    customerToUpdate.remainingAmount = previousAmount + totalBillAmount - (totalCollection + totalLess + totalWastage);
    
    const updatedCustomer = await customerToUpdate.save();

    console.log('After Update:', {
      newTotalAmount: updatedCustomer.totalAmount,
      newRemainingAmount: updatedCustomer.remainingAmount
    });

    // Populate and return bill - make sure to include additionalPrice in the response
    const populatedBill = await Bill.findById(bill._id)
      .populate('customer', 'name')
      .populate('items.product', 'name price');

    // Log the populated bill to verify additionalPrice is present
    console.log('Created bill:', {
      _id: populatedBill._id,
      billNumber: populatedBill.billNumber,
      additionalPrice: populatedBill.additionalPrice,
      total: populatedBill.total
    });

    res.status(201).json(populatedBill);

  } catch (error) {
    console.error('Error creating bill:', error);
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
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('customer', 'name address')
      .populate('items.product', 'name price');

    if (!bill) {
      res.status(404);
      throw new Error('Bill not found');
    }

    // Explicitly check for additionalPrice and log it
    console.log('Fetched bill additionalPrice check:', {
      hasProp: bill.hasOwnProperty('additionalPrice'),
      value: bill.additionalPrice,
      rawBill: JSON.stringify(bill)
    });

    // Here we make sure to send all fields, including additionalPrice
    res.status(200).json(bill);
  } catch (error) {
    console.error('Error fetching bill:', error);
    res.status(500);
    throw new Error(`Error fetching bill: ${error.message}`);
  }
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
    const billNumber = parseInt(req.params.billNumber);

    if (amount === undefined) {
      res.status(400);
      throw new Error('Please provide wastage amount');
    }

    const bill = await Bill.findOne({ billNumber });
    if (!bill) {
      res.status(404);
      throw new Error('Bill not found');
    }

    const customer = await Customer.findById(bill.customer);
    if (!customer) {
      res.status(404);
      throw new Error('Customer not found');
    }

    // Add payment info
    customer.paymentInfo.push({
      type: 'wastage',
      amount: Number(amount),
      date: new Date()
    });

    // Get customer stats for total remaining calculation
    const bills = await Bill.find({ customer: customer._id });
    const previousAmount = customer.previousAmount || 0;
    const totalBillAmount = bills.reduce((sum, bill) => sum + (bill.total || 0), 0);
    const payments = customer.paymentInfo;
    const totalCollection = payments.reduce((sum, payment) => 
      payment.type === 'collection' ? sum + Number(payment.amount) : sum, 0);
    const totalWastage = payments.reduce((sum, payment) => 
      payment.type === 'wastage' ? sum + Number(payment.amount) : sum, 0);
    const totalLess = payments.reduce((sum, payment) => 
      payment.type === 'less' ? sum + Number(payment.amount) : sum, 0);

    // Calculate total remaining as per customer details
    const totalRemaining = previousAmount + totalBillAmount - (totalCollection + totalLess + totalWastage);

    // Update customer's remaining amount
    customer.remainingAmount = totalRemaining;

    await customer.save();

    // Update bill's remaining amount to match customer's total remaining
    await Bill.findOneAndUpdate(
      { billNumber },
      { remainingAmount: totalRemaining },
      { new: true }
    );

    res.status(200).json({
      customer,
      stats: {
        previousAmount,
        totalBillAmount,
        totalCollection,
        totalWastage,
        totalLess,
        totalRemaining
      }
    });
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

    const customer = await Customer.findById(bill.customer);
    if (!customer) {
      res.status(404);
      throw new Error('Customer not found');
    }

    // Add payment info
    customer.paymentInfo.push({
      type: 'less',
      amount: Number(amount),
      date: new Date()
    });

    // Get customer stats for total remaining calculation
    const bills = await Bill.find({ customer: customer._id });
    const previousAmount = customer.previousAmount || 0;
    const totalBillAmount = bills.reduce((sum, bill) => sum + (bill.total || 0), 0);
    const payments = customer.paymentInfo;
    const totalCollection = payments.reduce((sum, payment) => 
      payment.type === 'collection' ? sum + Number(payment.amount) : sum, 0);
    const totalWastage = payments.reduce((sum, payment) => 
      payment.type === 'wastage' ? sum + Number(payment.amount) : sum, 0);
    const totalLess = payments.reduce((sum, payment) => 
      payment.type === 'less' ? sum + Number(payment.amount) : sum, 0);

    // Calculate total remaining as per customer details
    const totalRemaining = previousAmount + totalBillAmount - (totalCollection + totalLess + totalWastage);

    // Update customer's remaining amount
    customer.remainingAmount = totalRemaining;

    await customer.save();

    // Update bill's remaining amount to match customer's total remaining
    await Bill.findOneAndUpdate(
      { billNumber },
      { remainingAmount: totalRemaining },
      { new: true }
    );

    res.status(200).json({
      customer,
      stats: {
        previousAmount,
        totalBillAmount,
        totalCollection,
        totalWastage,
        totalLess,
        totalRemaining
      }
    });
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

    const customer = await Customer.findById(bill.customer);
    if (!customer) {
      res.status(404);
      throw new Error('Customer not found');
    }

    // Add payment info
    customer.paymentInfo.push({
      type: 'collection',
      amount: Number(amount),
      date: new Date()
    });

    // Get customer stats for total remaining calculation
    const bills = await Bill.find({ customer: customer._id });
    const previousAmount = customer.previousAmount || 0;
    const totalBillAmount = bills.reduce((sum, bill) => sum + (bill.total || 0), 0);
    const payments = customer.paymentInfo;
    const totalCollection = payments.reduce((sum, payment) => 
      payment.type === 'collection' ? sum + Number(payment.amount) : sum, 0);
    const totalWastage = payments.reduce((sum, payment) => 
      payment.type === 'wastage' ? sum + Number(payment.amount) : sum, 0);
    const totalLess = payments.reduce((sum, payment) => 
      payment.type === 'less' ? sum + Number(payment.amount) : sum, 0);

    // Calculate total remaining as per customer details
    const totalRemaining = previousAmount + totalBillAmount - (totalCollection + totalLess + totalWastage);

    // Update customer's remaining amount
    customer.remainingAmount = totalRemaining;

    await customer.save();

    // Update bill's remaining amount to match customer's total remaining
    await Bill.findOneAndUpdate(
      { billNumber },
      { remainingAmount: totalRemaining },
      { new: true }
    );

    res.status(200).json({
      customer,
      stats: {
        previousAmount,
        totalBillAmount,
        totalCollection,
        totalWastage,
        totalLess,
        totalRemaining
      }
    });
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