import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoriesHierarchy,
  getCategoryById,
  getCategoryBySlug,
  toggleCategoryStatus,
  updateCategory,
} from '../controllers/category.controller';
import { authenticateToken } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { createCategorySchema, updateCategorySchema, categoryQuerySchema } from '../dto/category.dto';

const router: Router = Router();

router.get('/', validate(categoryQuerySchema, 'query'), getCategories);
router.get('/hierarchy', getCategoriesHierarchy);
router.get('/:id', getCategoryById);
router.get('/slug/:slug', getCategoryBySlug);

router.post('/', authenticateToken, validate(createCategorySchema), createCategory);
router.put('/:id', authenticateToken, validate(updateCategorySchema), updateCategory);
router.delete('/:id', authenticateToken, deleteCategory);
router.patch('/:id/toggle', authenticateToken, toggleCategoryStatus);

export default router;
