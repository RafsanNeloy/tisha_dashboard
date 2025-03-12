const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getBills,
  addBill,
  deleteBill,
  getBill,
  getProductBills,
  updateWastage,
  updateLess,
  updateCollection
} = require('../controllers/billController');

// Apply protect middleware to all routes
router.use(protect);

router.route('/')
  .get(getBills)
  .post(addBill);

router.route('/:id')
  .get(getBill)
  .delete(deleteBill);

// New routes for updating amounts
router.put('/:billNumber/wastage', updateWastage);
router.put('/:billNumber/less', updateLess);
router.put('/:billNumber/collection', updateCollection);

router.get('/product/:id', getProductBills);

module.exports = router; 