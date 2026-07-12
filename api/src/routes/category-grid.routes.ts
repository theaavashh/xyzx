import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { categoryGridCreateSchema, categoryGridUpdateSchema, categoryGridReorderSchema } from '../dto/category-grid.dto';
import {
  getAllCategoryGridItems,
  getActiveCategoryGridItems,
  getCategoryGridItemById,
  createCategoryGridItem,
  updateCategoryGridItem,
  deleteCategoryGridItem,
  toggleCategoryGridItemStatus,
  reorderCategoryGridItems,
} from '../controllers/category-grid.controller';

const router: Router = Router();

router.get('/active', getActiveCategoryGridItems);
router.get('/', authenticateToken, requireAdmin, getAllCategoryGridItems);
router.get('/:id', authenticateToken, requireAdmin, getCategoryGridItemById);
router.post('/', authenticateToken, requireAdmin, validate(categoryGridCreateSchema), createCategoryGridItem);
router.put('/:id', authenticateToken, requireAdmin, validate(categoryGridUpdateSchema), updateCategoryGridItem);
router.delete('/:id', authenticateToken, requireAdmin, deleteCategoryGridItem);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleCategoryGridItemStatus);
router.patch('/reorder', authenticateToken, requireAdmin, validate(categoryGridReorderSchema), reorderCategoryGridItems);

export default router;
