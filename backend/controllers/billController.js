const asyncHandler = require('express-async-handler');
const Bill = require('../models/billModel');
const Product = require('../models/productModel');
const Customer = require('../models/customerModel');
const Stock = require('../models/stockModel');

// @desc    Get all bills
// @route   GET /api/bills
// @access  Private
const getBills = asyncHandler(async (req, res) => {
  const bills = await Bill.find()
    .populate('customer', 'name')
    .populate('items.product', 'name price')
    .select('user billNumber customer items additionalPrice discountPercentage discountAmount total date createdAt updatedAt');
  res.status(200).json(bills);
});

// Helper function to get the next bill number
const getNextBillNumber = async () => {
    const lastBill = await Bill.findOne().sort({ billNumber: -1 });
    return lastBill ? lastBill.billNumber + 1 : 1;
};

// Helper function to update stock
const updateStockForBill = async (items, operation = 'increment', session = null) => {
    try {
        for (const item of items) {
            const stockUpdate = {
                $inc: { 
                    billedStock: operation === 'increment' ? item.quantity : -item.quantity 
                }
            };
            
            const options = session ? { session } : {};
            await Stock.findOneAndUpdate(
                { product: item.product },
                stockUpdate,
                { ...options, new: true }
            );
        }
        return true;
    } catch (error) {
        throw error;
    }
};

// @desc    Add new bill
// @route   POST /api/bills
// @access  Private
const addBill = asyncHandler(async (req, res) => {
    const { 
        customer, 
        items, 
        total, 
        paid, 
        due,
        additionalPrice = 0,
        discountPercentage = 0,
        discountAmount = 0
    } = req.body;

    if (!customer || !items || items.length === 0) {
      res.status(400);
        throw new Error('Please add all required fields');
    }

    try {
        const subtotal = items.reduce((sum, item) => sum + item.subTotal, 0);
        const totalWithAdditional = subtotal + (additionalPrice || 0);
        const finalDiscountAmount = discountAmount || (totalWithAdditional * (discountPercentage / 100));
        const finalTotal = totalWithAdditional - finalDiscountAmount;

        const bill = await Bill.create({
            billNumber: await getNextBillNumber(),
            customer,
            items,
            total: finalTotal,
            additionalPrice,
            discountPercentage,
            discountAmount: finalDiscountAmount,
            paid: paid || 0,
            due: finalTotal - (paid || 0),
            user: req.user.id
        });

        await updateStockForBill(items, 'increment');

        await Customer.findByIdAndUpdate(
            customer,
            { 
                $push: { bills: bill._id },
                $inc: { remainingAmount: finalTotal - (paid || 0) }
            }
        );

        const io = req.app.get('io');
        items.forEach(item => {
            io.emit('stockUpdate', {
                productId: item.product,
                type: 'bill_created'
            });
        });

        res.status(201).json(bill);

  } catch (error) {
    res.status(500);
    throw new Error(`Error creating bill: ${error.message}`);
  }
});

// @desc    Delete bill
// @route   DELETE /api/bills/:id
// @access  Private/Admin
const deleteBill = asyncHandler(async (req, res) => {
    const bill = await Bill.findById(req.params.id)
        .populate('customer')
        .populate('items.product');

  if (!bill) {
    res.status(404);
    throw new Error('Bill not found');
  }

  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete bills');
  }

    try {
        await updateStockForBill(bill.items, 'decrement');

        await Customer.findByIdAndUpdate(
            bill.customer._id,
            { 
                $pull: { bills: bill._id },
                $inc: { remainingAmount: -(bill.total - bill.paid) }
            }
        );

  await bill.deleteOne();

        const io = req.app.get('io');
        bill.items.forEach(item => {
            io.emit('stockUpdate', {
                productId: item.product._id,
                type: 'bill_deleted'
            });
        });

  res.status(200).json(bill);

    } catch (error) {
        res.status(500);
        throw new Error(`Error deleting bill: ${error.message}`);
    }
});

// @desc    Get single bill
// @route   GET /api/bills/:id
// @access  Private
const getBill = asyncHandler(async (req, res) => {
    const bill = await Bill.findById(req.params.id)
      .populate('customer', 'name address')
      .populate('items.product', 'name price')
      .select('user billNumber customer items additionalPrice discountPercentage discountAmount total date createdAt updatedAt');

    if (!bill) {
      res.status(404);
      throw new Error('Bill not found');
    }

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