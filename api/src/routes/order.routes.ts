import { Router } from 'express';
import { authenticateToken, optionalAuth, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { orderStatusSchema, orderFiltersSchema } from '../dto/order.dto';
import {
  getOrders,
  getMyOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/order.controller';

const router: ReturnType<typeof Router> = Router();

router.get('/', authenticateToken, requireAdmin, getOrders);
router.get('/me', authenticateToken, getMyOrders);
router.get('/:id', authenticateToken, getOrderById);
router.post('/', optionalAuth, createOrder);
router.patch('/:id/status', authenticateToken, requireAdmin, validate(orderStatusSchema), updateOrderStatus);
router.patch('/:id/cancel', authenticateToken, cancelOrder);

export default router;
