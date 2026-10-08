import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth.js';
import {
  getStock,
  updateStock,
  deductStockForOrder,
  restoreStockForOrder,
  getInventoryLogs,
  getLowStockProducts,
  getInventoryStats,
  getVariantInventory,
  updateVariantStock,
} from '../controllers/inventory.controller.di.js';

const router: Router = Router();

// Admin routes
router.get('/stats', authenticateToken, requireAdmin, getInventoryStats);
router.get('/low-stock', authenticateToken, requireAdmin, getLowStockProducts);
router.get('/logs', authenticateToken, requireAdmin, getInventoryLogs);
router.get('/variants', authenticateToken, requireAdmin, getVariantInventory);

router.get('/:productId', authenticateToken, requireAdmin, getStock);
router.post('/:productId', authenticateToken, requireAdmin, updateStock);
router.post('/deduct', authenticateToken, requireAdmin, deductStockForOrder);
router.post('/restore', authenticateToken, requireAdmin, restoreStockForOrder);

router.post('/variants/:variantId', authenticateToken, requireAdmin, updateVariantStock);

export default router;