import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { heroSlideCreateSchema, heroSlideUpdateSchema, heroSlideReorderSchema } from '../dto/hero-slide.dto';
import {
  getAllHeroSlides,
  getActiveHeroSlides,
  getHeroSlideById,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  toggleHeroSlideStatus,
  reorderHeroSlides,
} from '../controllers/hero-slide.controller';

const router: Router = Router();

router.get('/active', getActiveHeroSlides);
router.get('/', authenticateToken, requireAdmin, getAllHeroSlides);
router.get('/:id', authenticateToken, requireAdmin, getHeroSlideById);
router.post('/', authenticateToken, requireAdmin, validate(heroSlideCreateSchema), createHeroSlide);
router.put('/:id', authenticateToken, requireAdmin, validate(heroSlideUpdateSchema), updateHeroSlide);
router.delete('/:id', authenticateToken, requireAdmin, deleteHeroSlide);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleHeroSlideStatus);
router.patch('/reorder', authenticateToken, requireAdmin, validate(heroSlideReorderSchema), reorderHeroSlides);

export default router;
