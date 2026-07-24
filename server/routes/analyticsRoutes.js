import express from 'express';
import { getDashboardStats, getSalesAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/dashboard', getDashboardStats);
router.get('/sales', getSalesAnalytics);

export default router;
