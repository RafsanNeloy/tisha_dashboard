const asyncHandler = require('express-async-handler');
const Customer = require('../models/customerModel');
const Bill = require('../models/billModel');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find({}).lean();
  res.status(200).json(customers);
});

// @desc    Add new customer
// @route   POST /api/customers
// @access  Private
const addCustomer = asyncHandler(async (req, res) => {
  const { name, mobile, address, previousAmount } = req.body;

  if (!name || !mobile || !address) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const customer = await Customer.create({
    name,
    mobile,
    address,
    previousAmount: previousAmount || 0,
    user: req.user._id
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

  // Allow both admin and the user who created the customer to update it
  if (customer.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this customer');
  }

  // For previousAmount, just set it directly
  if (req.body.previousAmount !== undefined) {
    req.body.previousAmount = parseFloat(req.body.previousAmount) || 0;
  }

  const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json(updatedCustomer);
});

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private/Admin
const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  // Only allow admins to delete customers
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete customers');
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

  // Remove the user authorization check since all users can view customers
  res.status(200).json(customer);
});

// @desc    Get customer bills
// @route   GET /api/customers/:id/bills
// @access  Public
const getCustomerBills = asyncHandler(async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            res.status(404);
            throw new Error('Customer not found');
        }

        const bills = await Bill.find({ customer: req.params.id })
            .sort({ date: -1 })
            .populate('customer', 'name')
            .populate('items.product', 'name price');

        // Get the latest previousAmount directly from the customer document
        const previousAmountValue = customer.previousAmount || 0;

        // Calculate statistics
        const totalBillAmount = bills.reduce((sum, bill) => sum + (bill.total || 0), 0);
        
        // Calculate totals from paymentInfo array
        const payments = customer.paymentInfo || [];
        const totalCollection = payments.reduce((sum, payment) => 
            payment.type === 'collection' ? sum + payment.amount : sum, 0);
        const totalWastage = payments.reduce((sum, payment) => 
            payment.type === 'wastage' ? sum + payment.amount : sum, 0);
        const totalLess = payments.reduce((sum, payment) => 
            payment.type === 'less' ? sum + payment.amount : sum, 0);

        // Calculate total remaining using the formula
        const totalRemaining = previousAmountValue + totalBillAmount - (totalCollection + totalLess + totalWastage);

        const stats = {
            previousAmount: previousAmountValue,
            totalBillAmount,
            totalCollection,
            totalWastage,
            totalLess,
            totalRemaining
        };

        // Add debug logging
        console.log('Customer Data:', {
            customerId: customer._id,
            previousAmount: previousAmountValue,
            totalBillAmount,
            totalCollection,
            totalWastage,
            totalLess,
            totalRemaining,
            stats
        });

        res.status(200).json({
            customer: {
                ...customer.toObject(),
                previousAmount: previousAmountValue
            },
            bills,
            stats
        });
    } catch (error) {
        console.error('Error in getCustomerBills:', error);
        res.status(500);
        throw new Error('Error fetching customer bills');
    }
});

// @desc    Add payment (wastage/less/collection)
// @route   POST /api/customers/:id/payment
// @access  Private
const addCustomerPayment = asyncHandler(async (req, res) => {
  const { type, amount } = req.body;
  
  if (!type || !amount) {
    res.status(400);
    throw new Error('Please provide payment type and amount');
  }

  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  // Add payment info
  customer.paymentInfo.push({
    type,
    amount,
    date: new Date()
  });

  // Calculate new remaining amount
  const bills = await Bill.find({ customer: req.params.id });
  const previousAmount = customer.previousAmount || 0;
  const totalBillAmount = bills.reduce((sum, bill) => sum + (bill.total || 0), 0);
  
  // Calculate totals from all payments including the new one
  const payments = customer.paymentInfo;
  const totalCollection = payments.reduce((sum, payment) => 
    payment.type === 'collection' ? sum + payment.amount : sum, 0);
  const totalWastage = payments.reduce((sum, payment) => 
    payment.type === 'wastage' ? sum + payment.amount : sum, 0);
  const totalLess = payments.reduce((sum, payment) => 
    payment.type === 'less' ? sum + payment.amount : sum, 0);

  // Update the remaining amount using the consistent formula
  const totalRemaining = previousAmount + totalBillAmount - (totalCollection + totalLess + totalWastage);
  customer.remainingAmount = totalRemaining;

  // Save the customer with updated payment info and remaining amount
  const updatedCustomer = await customer.save();

  // Return full customer data with stats
  res.status(200).json({
    customer: updatedCustomer,
    stats: {
      previousAmount,
      totalBillAmount,
      totalCollection,
      totalWastage,
      totalLess,
      totalRemaining
    }
  });
});

// @desc    Get customer payment history
// @route   GET /api/customers/:id/payments
// @access  Private
const getPaymentHistory = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id)
    .populate('bills')
    .select('name mobile address totalAmount remainingAmount paymentInfo bills');

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  // Calculate payment type totals
  const paymentTypeTotals = customer.paymentInfo.reduce((totals, payment) => {
    if (!totals[payment.type]) {
      totals[payment.type] = 0;
    }
    totals[payment.type] += payment.amount;
    return totals;
  }, {});

  res.status(200).json({
    ...customer.toObject(),
    paymentTypeTotals
  });
});

// Update the addBill controller to update customer's totalAmount
const addBill = asyncHandler(async (req, res) => {
  const { customer: customerId, total } = req.body;

  const customer = await Customer.findById(customerId);
  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  const bill = await Bill.create(req.body);

  // Update customer's bills and amounts
  customer.bills.push(bill._id);
  customer.totalAmount += total;
  await customer.save();

  res.status(201).json(bill);
});

module.exports = {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomer,
  getCustomerBills,
  addCustomerPayment,
  getPaymentHistory
}; 