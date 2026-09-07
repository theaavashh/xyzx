import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { promotionalBannerCreateSchema, promotionalBannerUpdateSchema } from '../dto/promotional-banner.dto';
import {
  getPromotionalBanners,
  getActivePromotionalBanners,
  getPromotionalBannerById,
  createPromotionalBanner,
  updatePromotionalBanner,
  deletePromotionalBanner,
  togglePromotionalBannerStatus,
} from '../controllers/promotional-banner.controller';

const router: Router = Router();

router.get('/active', getActivePromotionalBanners);
router.get('/', authenticateToken, requireAdmin, getPromotionalBanners);
router.get('/:id', authenticateToken, requireAdmin, getPromotionalBannerById);
router.post('/', authenticateToken, requireAdmin, validate(promotionalBannerCreateSchema), createPromotionalBanner);
router.put('/:id', authenticateToken, requireAdmin, validate(promotionalBannerUpdateSchema), updatePromotionalBanner);
router.delete('/:id', authenticateToken, requireAdmin, deletePromotionalBanner);
router.patch('/:id/toggle', authenticateToken, requireAdmin, togglePromotionalBannerStatus);

export default router;
