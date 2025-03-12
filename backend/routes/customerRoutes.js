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

// Public route - no authentication required
router.get('/:id/bills', getCustomerBills);

// Protected routes - require authentication
router.use(protect); // Apply protect middleware to all routes below this

router.route('/')
  .get(getCustomers)
  .post(addCustomer);

router.route('/:id')
  .get(getCustomer)
  .put(updateCustomer)
  .delete(deleteCustomer);

module.exports = router; 