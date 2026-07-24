import express from 'express';
import {
  getDashboardStats,
  getEarnings,
  updateStoreSettings,
} from '../controllers/vendorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect, authorize('vendor'));
router.get('/dashboard', getDashboardStats);
router.get('/earnings', getEarnings);
router.put('/settings', updateStoreSettings);

export default router;
