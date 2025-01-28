const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomer,
  getCustomerBills
} = require('../controllers/customerController');

router.route('/')
  .get(protect, getCustomers)
  .post(protect, addCustomer);

router.route('/:id')
  .get(protect, getCustomer)
  .put(protect, updateCustomer)
  .delete(protect, deleteCustomer);

router.get('/:id/bills', protect, getCustomerBills);

module.exports = router; 