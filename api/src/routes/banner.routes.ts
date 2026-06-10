import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { bannerCreateSchema, bannerUpdateSchema } from '../dto/banner.dto';
import {
  getBanners,
  getActiveBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
} from '../controllers/banner.controller';

const router: Router = Router();

router.get('/active', getActiveBanners);
router.get('/', authenticateToken, requireAdmin, getBanners);
router.get('/:id', authenticateToken, requireAdmin, getBannerById);
router.post('/', authenticateToken, requireAdmin, validate(bannerCreateSchema), createBanner);
router.put('/:id', authenticateToken, requireAdmin, validate(bannerUpdateSchema), updateBanner);
router.delete('/:id', authenticateToken, requireAdmin, deleteBanner);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleBannerStatus);

export default router;
