const asyncHandler = require('express-async-handler');
const Bill = require('../models/billModel');
const Product = require('../models/productModel');
const Customer = require('../models/customerModel');
const Stock = require('../models/stockModel');
const axios = require('axios');

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

// Helper function to handle stock updates
const updateStockForBill = async (items, io) => {
    try {
        for (const item of items) {
            const updatedStock = await Stock.findOneAndUpdate(
                { product: item.product },
                {
                    $inc: { billedStock: item.quantity },
                    $setOnInsert: {
                        previousStock: 0,
                        addedStock: []
                    }
                },
                { 
                    new: true, 
                    upsert: true
                }
            );
            
            // Emit stock update event
            io.emit('stockUpdate', {
                productId: item.product,
                stock: updatedStock
            });
        }
        return true;
    } catch (error) {
        throw new Error(`Stock update failed: ${error.message}`);
    }
};

// @desc    Add new bill
// @route   POST /api/bills
// @access  Private
const addBill = asyncHandler(async (req, res) => {
    const io = req.app.get('io');
    const { customer, items, total, paid, due } = req.body;

    if (!customer || !items || items.length === 0) {
        res.status(400);
        throw new Error('Please add all required fields');
    }

    try {
        // 1. Get the next bill number
        const billNumber = await getNextBillNumber();

        // 2. Create the bill with the generated bill number
        const bill = await Bill.create({
            billNumber,
            customer,
            items,
            total,
            paid: paid || 0,
            due: due || total,
            user: req.user.id,
            date: new Date()
        });

        // 3. Update stock for each product
        await updateStockForBill(items, io);

        // 4. Update customer's bills array and remaining amount
        await Customer.findByIdAndUpdate(
            customer,
            { 
                $push: { bills: bill._id },
                $inc: { remainingAmount: total - (paid || 0) }
            }
        );

        // 5. Fetch the complete bill with populated fields
        const completeBill = await Bill.findById(bill._id)
            .populate('customer', 'name')
            .populate('items.product', 'name price');

        res.status(201).json(completeBill);

    } catch (error) {
        // If any operation fails, we need to handle cleanup
        if (error.message.includes('Stock update failed') && bill) {
            // If stock update failed, delete the created bill
            await Bill.findByIdAndDelete(bill._id);
        }
        
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
    console.log('Getting bill with ID:', req.params.id);
    
    const bill = await Bill.findById(req.params.id)
      .populate('customer', 'name address')
      .populate('items.product', 'name price')
      .select('user billNumber customer items additionalPrice discountPercentage discountAmount total date createdAt updatedAt');

    if (!bill) {
      console.log('Bill not found:', req.params.id);
      res.status(404);
      throw new Error('Bill not found');
    }

 

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