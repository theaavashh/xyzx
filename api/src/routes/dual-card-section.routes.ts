import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { dualCardSectionCreateSchema, dualCardSectionUpdateSchema, dualCardSectionReorderSchema } from '../dto/dual-card-section.dto';
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
router.post('/', authenticateToken, requireAdmin, validate(dualCardSectionCreateSchema), createDualCardSection);
router.put('/:id', authenticateToken, requireAdmin, validate(dualCardSectionUpdateSchema), updateDualCardSection);
router.delete('/:id', authenticateToken, requireAdmin, deleteDualCardSection);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleDualCardSectionStatus);
router.patch('/reorder', authenticateToken, requireAdmin, validate(dualCardSectionReorderSchema), reorderDualCardSections);

export default router;
