import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import {
  createDelivery,
  getDeliveryByOrder,
  getDeliveryById,
  updateDeliveryStatus,
  getActiveDeliveries,
  getDeliveriesByStatus,
  getDeliveryStats,
  deleteDelivery,
} from '../controllers/delivery.controller';

const router: Router = Router();

router.get('/stats', authenticateToken, getDeliveryStats);
router.get('/active', authenticateToken, getActiveDeliveries);
router.get('/status/:status', authenticateToken, getDeliveriesByStatus);
router.get('/order/:orderId', authenticateToken, getDeliveryByOrder);
router.get('/:id', authenticateToken, getDeliveryById);
router.post('/', authenticateToken, requireAdmin, createDelivery);
router.patch('/order/:orderId', authenticateToken, requireAdmin, updateDeliveryStatus);
router.delete('/:id', authenticateToken, requireAdmin, deleteDelivery);

export default router;
