import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth.js';
import {
  createDelivery,
  getDeliveryByOrderId,
  getDeliveryById,
  updateDeliveryStatus,
  getActiveDeliveries,
  getDeliveriesByStatus,
  getDeliveryStats,
  deleteDelivery,
} from '../controllers/delivery.controller.di.js';

const router: Router = Router();

// All routes require admin authentication
router.post('/', authenticateToken, requireAdmin, createDelivery);
router.get('/active', authenticateToken, requireAdmin, getActiveDeliveries);
router.get('/by-status', authenticateToken, requireAdmin, getDeliveriesByStatus);
router.get('/stats', authenticateToken, requireAdmin, getDeliveryStats);
router.get('/order/:orderId', authenticateToken, requireAdmin, getDeliveryByOrderId);
router.get('/:id', authenticateToken, requireAdmin, getDeliveryById);
router.patch('/order/:orderId', authenticateToken, requireAdmin, updateDeliveryStatus);
router.delete('/:id', authenticateToken, requireAdmin, deleteDelivery);

export default router;