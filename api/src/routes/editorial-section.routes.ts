import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { editorialSectionCreateSchema, editorialSectionUpdateSchema, editorialSectionReorderSchema } from '../dto/editorial-section.dto';
import {
  getEditorialSections,
  getActiveEditorialSections,
  getEditorialSectionById,
  createEditorialSection,
  updateEditorialSection,
  deleteEditorialSection,
  toggleEditorialSectionStatus,
  reorderEditorialSections,
} from '../controllers/editorial-section.controller';

const router: Router = Router();

router.get('/active', getActiveEditorialSections);
router.get('/', authenticateToken, requireAdmin, getEditorialSections);
router.get('/:id', authenticateToken, requireAdmin, getEditorialSectionById);
router.post('/', authenticateToken, requireAdmin, validate(editorialSectionCreateSchema), createEditorialSection);
router.put('/:id', authenticateToken, requireAdmin, validate(editorialSectionUpdateSchema), updateEditorialSection);
router.delete('/:id', authenticateToken, requireAdmin, deleteEditorialSection);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleEditorialSectionStatus);
router.patch('/reorder', authenticateToken, requireAdmin, validate(editorialSectionReorderSchema), reorderEditorialSections);

export default router;
