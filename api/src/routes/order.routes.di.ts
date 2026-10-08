import { Router } from 'express';
import { authenticateToken, optionalAuth, requireAdmin } from '../middlewares/auth.js';
import {
  getOrders,
  getMyOrders,
  getOrderById,
  getOrderByNumber,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderItems,
} from '../controllers/order.controller.di.js';

const router: Router = Router();

// Guest checkout is allowed; authenticated requests attach userId
router.post('/', optionalAuth, createOrder);

// User routes (authenticated)
router.get('/me', authenticateToken, getMyOrders);
router.get('/', authenticateToken, requireAdmin, getOrders);
router.get('/number/:orderNumber', authenticateToken, getOrderByNumber);
router.get('/:id', authenticateToken, getOrderById);
router.get('/:id/items', authenticateToken, getOrderItems);

// Admin routes
router.patch('/:id/status', authenticateToken, requireAdmin, updateOrderStatus);
router.post('/:id/cancel', authenticateToken, requireAdmin, cancelOrder);

export default router;
