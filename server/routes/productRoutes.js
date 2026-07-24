import express from 'express';
import {
  getProducts,
  getProductById,
  getVendorProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/categories', getCategories);
router.get('/vendor/mine', protect, authorize('vendor'), getVendorProducts);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorize('vendor'), createProduct);
router.put('/:id', protect, authorize('vendor', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('vendor', 'admin'), deleteProduct);

export default router;
