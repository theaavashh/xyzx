import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { sectionCreateSchema, sectionUpdateSchema, sectionReorderSchema } from '../dto/section.dto';
import {
  getDualCardSections,
  getActiveDualCardSections,
  getDualCardSectionById,
  createDualCardSection,
  updateDualCardSection,
  deleteDualCardSection,
  toggleDualCardSectionStatus,
  reorderDualCardSections,
} from '../controllers/dual-card-section.controller';

const router: Router = Router();

router.get('/active', getActiveDualCardSections);
router.get('/', authenticateToken, requireAdmin, getDualCardSections);
router.get('/:id', authenticateToken, requireAdmin, getDualCardSectionById);
router.post('/', authenticateToken, requireAdmin, validate(sectionCreateSchema), createDualCardSection);
router.put('/:id', authenticateToken, requireAdmin, validate(sectionUpdateSchema), updateDualCardSection);
router.delete('/:id', authenticateToken, requireAdmin, deleteDualCardSection);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleDualCardSectionStatus);
router.patch('/reorder', authenticateToken, requireAdmin, validate(sectionReorderSchema), reorderDualCardSections);

export default router;
