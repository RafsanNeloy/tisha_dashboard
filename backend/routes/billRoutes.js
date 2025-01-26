const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const {
  getBills,
  addBill,
  deleteBill,
  getBill
} = require('../controllers/billController');

router.route('/')
  .get(protect, getBills)
  .post(protect, addBill);

router.route('/:id')
  .get(protect, getBill)
  .delete(protect, isAdmin, deleteBill);

module.exports = router; 