import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getVendorOrders,
  getAdminOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.post('/', authorize('customer'), createOrder);
router.get('/my', getMyOrders);
router.get('/vendor', authorize('vendor'), getVendorOrders);
router.get('/admin', authorize('admin'), getAdminOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', authorize('vendor', 'admin'), updateOrderStatus);

export default router;
