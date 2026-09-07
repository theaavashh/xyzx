import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import {
  categoryTileGridCreateSchema,
  categoryTileGridUpdateSchema,
} from '../dto/category-tile-grid.dto';
import {
  getAllCategoryTileGridSections,
  getActiveCategoryTileGridSections,
  getCategoryTileGridSectionById,
  createCategoryTileGridSection,
  updateCategoryTileGridSection,
  deleteCategoryTileGridSection,
  toggleCategoryTileGridSectionStatus,
} from '../controllers/category-tile-grid.controller';

const router: Router = Router();

router.get('/active', getActiveCategoryTileGridSections);
router.get('/', authenticateToken, requireAdmin, getAllCategoryTileGridSections);
router.get('/:id', authenticateToken, requireAdmin, getCategoryTileGridSectionById);
router.post('/', authenticateToken, requireAdmin, validate(categoryTileGridCreateSchema), createCategoryTileGridSection);
router.put('/:id', authenticateToken, requireAdmin, validate(categoryTileGridUpdateSchema), updateCategoryTileGridSection);
router.delete('/:id', authenticateToken, requireAdmin, deleteCategoryTileGridSection);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleCategoryTileGridSectionStatus);

export default router;
