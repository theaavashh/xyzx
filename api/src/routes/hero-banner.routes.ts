import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { heroBannerCreateSchema, heroBannerUpdateSchema, sectionReorderSchema } from '../dto/section.dto';
import {
  getHeroBanners,
  getActiveHeroBanners,
  getHeroBannerById,
  createHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
  toggleHeroBannerStatus,
  reorderHeroBanners,
} from '../controllers/hero-banner.controller';

const router: Router = Router();

router.get('/active', getActiveHeroBanners);
router.get('/', authenticateToken, requireAdmin, getHeroBanners);
router.get('/:id', authenticateToken, requireAdmin, getHeroBannerById);
router.post('/', authenticateToken, requireAdmin, validate(heroBannerCreateSchema), createHeroBanner);
router.put('/:id', authenticateToken, requireAdmin, validate(heroBannerUpdateSchema), updateHeroBanner);
router.delete('/:id', authenticateToken, requireAdmin, deleteHeroBanner);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleHeroBannerStatus);
router.patch('/reorder', authenticateToken, requireAdmin, validate(sectionReorderSchema), reorderHeroBanners);

export default router;
