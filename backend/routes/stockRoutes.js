const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProductStock,
  addStock,
  updatePreviousStock,
  updateBilledStock
} = require('../controllers/stockController');

router.use(protect);

router.route('/:productId')
  .get(getProductStock);

router.route('/:productId')
  .post(addStock);

router.route('/:productId/previous')
  .put(updatePreviousStock);

router.route('/:productId/billed')
  .put(updateBilledStock);

module.exports = router; 