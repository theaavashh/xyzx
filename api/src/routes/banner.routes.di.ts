import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth.js';
import {
  getBanners,
  getActiveBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
} from '../controllers/banner.controller.di.js';

const router: Router = Router();

// Public routes
router.get('/', getBanners);
router.get('/active', getActiveBanners);
router.get('/:id', getBannerById);

// Admin routes
router.post('/', authenticateToken, requireAdmin, createBanner);
router.put('/:id', authenticateToken, requireAdmin, updateBanner);
router.delete('/:id', authenticateToken, requireAdmin, deleteBanner);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleBannerStatus);

export default router;