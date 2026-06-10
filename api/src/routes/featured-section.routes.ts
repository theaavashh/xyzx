import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { sectionCreateSchema, sectionUpdateSchema, sectionReorderSchema } from '../dto/section.dto';
import {
  getFeaturedSections,
  getActiveFeaturedSections,
  getFeaturedSectionById,
  createFeaturedSection,
  updateFeaturedSection,
  deleteFeaturedSection,
  toggleFeaturedSectionStatus,
  reorderFeaturedSections,
} from '../controllers/featured-section.controller';

const router: Router = Router();

router.get('/active', getActiveFeaturedSections);
router.get('/', authenticateToken, requireAdmin, getFeaturedSections);
router.get('/:id', authenticateToken, requireAdmin, getFeaturedSectionById);
router.post('/', authenticateToken, requireAdmin, validate(sectionCreateSchema), createFeaturedSection);
router.put('/:id', authenticateToken, requireAdmin, validate(sectionUpdateSchema), updateFeaturedSection);
router.delete('/:id', authenticateToken, requireAdmin, deleteFeaturedSection);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleFeaturedSectionStatus);
router.patch('/reorder', authenticateToken, requireAdmin, validate(sectionReorderSchema), reorderFeaturedSections);

export default router;
