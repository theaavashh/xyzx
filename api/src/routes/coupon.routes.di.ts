import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth.js';
import {
  getCoupons,
  getCouponById,
  getCouponByCode,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  getCouponStats,
  getActivePublicCoupons,
  incrementCouponUsedCount,
  validateCoupon,
} from '../controllers/coupon.controller.di.js';

const router: Router = Router();

// Public routes
router.get('/', getCoupons);
router.post('/validate', validateCoupon);
router.get('/active', getActivePublicCoupons);
router.get('/stats', authenticateToken, requireAdmin, getCouponStats);
router.get('/:id', getCouponById);
router.get('/code/:code', getCouponByCode);

// Admin routes
router.post('/', authenticateToken, requireAdmin, createCoupon);
router.put('/:id', authenticateToken, requireAdmin, updateCoupon);
router.delete('/:id', authenticateToken, requireAdmin, deleteCoupon);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleCouponStatus);
router.post('/:id/increment', authenticateToken, requireAdmin, incrementCouponUsedCount);

export default router;