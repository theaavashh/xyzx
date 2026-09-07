import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { threeImageGridCreateSchema, threeImageGridUpdateSchema } from '../dto/three-image-grid.dto';
import {
  getAllThreeImageGridSections,
  getActiveThreeImageGridSections,
  getThreeImageGridSectionById,
  createThreeImageGridSection,
  updateThreeImageGridSection,
  deleteThreeImageGridSection,
  toggleThreeImageGridSectionStatus,
} from '../controllers/three-image-grid.controller';

const router: Router = Router();

router.get('/active', getActiveThreeImageGridSections);
router.get('/', authenticateToken, requireAdmin, getAllThreeImageGridSections);
router.get('/:id', authenticateToken, requireAdmin, getThreeImageGridSectionById);
router.post('/', authenticateToken, requireAdmin, validate(threeImageGridCreateSchema), createThreeImageGridSection);
router.put('/:id', authenticateToken, requireAdmin, validate(threeImageGridUpdateSchema), updateThreeImageGridSection);
router.delete('/:id', authenticateToken, requireAdmin, deleteThreeImageGridSection);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleThreeImageGridSectionStatus);

export default router;
