import express from 'express';
import {
  getWarehouses,
  createWarehouse,
  getSuppliers,
  createSupplier,
  getPurchaseOrders,
  createPurchaseOrder,
  updatePOStatus,
  getLowStockAlerts,
  updateStock,
} from '../controllers/inventoryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect, authorize('inventory_manager', 'admin'));
router.get('/warehouses', getWarehouses);
router.post('/warehouses', createWarehouse);
router.get('/suppliers', getSuppliers);
router.post('/suppliers', createSupplier);
router.get('/purchase-orders', getPurchaseOrders);
router.post('/purchase-orders', createPurchaseOrder);
router.put('/purchase-orders/:id/status', updatePOStatus);
router.get('/low-stock', getLowStockAlerts);
router.put('/products/:productId/stock', updateStock);

export default router;
