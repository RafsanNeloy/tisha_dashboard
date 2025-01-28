const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProductBills
} = require('../controllers/productController');

router.route('/').get(protect, getProducts).post(protect, addProduct);
router.route('/:id')
  .get(protect, getProduct)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);
router.get('/:id/bills', protect, getProductBills);

module.exports = router; 