import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { orderStatusSchema, orderFiltersSchema } from '../dto/order.dto';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/order.controller';

const router: Router = Router();

router.get('/', authenticateToken, requireAdmin, getOrders);
router.get('/:id', authenticateToken, getOrderById);
router.post('/', authenticateToken, createOrder);
router.patch('/:id/status', authenticateToken, requireAdmin, validate(orderStatusSchema), updateOrderStatus);
router.patch('/:id/cancel', authenticateToken, cancelOrder);

export default router;
