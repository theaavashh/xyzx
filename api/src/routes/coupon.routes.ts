import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { couponCreateSchema, couponUpdateSchema } from '../dto/coupon.dto';
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
  validateCoupon,
} from '../controllers/coupon.controller';

const router: Router = Router();

router.get('/active', getActivePublicCoupons);
router.post('/validate', validateCoupon);

router.get('/stats', authenticateToken, requireAdmin, getCouponStats);
router.get('/code/:code', authenticateToken, requireAdmin, getCouponByCode);
router.get('/', authenticateToken, requireAdmin, getCoupons);
router.get('/:id', authenticateToken, requireAdmin, getCouponById);
router.post('/', authenticateToken, requireAdmin, validate(couponCreateSchema), createCoupon);
router.put('/:id', authenticateToken, requireAdmin, validate(couponUpdateSchema), updateCoupon);
router.delete('/:id', authenticateToken, requireAdmin, deleteCoupon);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleCouponStatus);

export default router;
