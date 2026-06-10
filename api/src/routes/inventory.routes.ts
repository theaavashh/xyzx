import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import {
  getInventoryStats,
  getStock,
  updateStock,
  getLowStockProducts,
  getInventoryLogs,
  deductStockForStoreSale,
  bulkUpdateStock,
} from '../controllers/inventory.controller';

const router: Router = Router();

router.get('/stats', authenticateToken, getInventoryStats);
router.get('/low-stock', authenticateToken, getLowStockProducts);
router.get('/logs', authenticateToken, getInventoryLogs);
router.get('/:productId', authenticateToken, getStock);
router.put('/:productId', authenticateToken, requireAdmin, updateStock);
router.post('/store-sale', authenticateToken, requireAdmin, deductStockForStoreSale);
router.post('/bulk', authenticateToken, requireAdmin, bulkUpdateStock);

export default router;
