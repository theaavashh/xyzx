import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth.js';
import {
  getActiveHeroSlides,
  getAllHeroSlides,
  getHeroSlideById,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  toggleHeroSlideStatus,
  reorderHeroSlides,
} from '../controllers/hero-slide.controller.di.js';

const router: Router = Router();

// Public routes
router.get('/active', getActiveHeroSlides);
router.get('/all', getAllHeroSlides);
router.get('/:id', getHeroSlideById);

// Admin routes
router.post('/', authenticateToken, requireAdmin, createHeroSlide);
router.put('/:id', authenticateToken, requireAdmin, updateHeroSlide);
router.delete('/:id', authenticateToken, requireAdmin, deleteHeroSlide);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleHeroSlideStatus);
router.post('/reorder', authenticateToken, requireAdmin, reorderHeroSlides);

export default router;