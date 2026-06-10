import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { sectionCreateSchema, sectionUpdateSchema, sectionReorderSchema } from '../dto/section.dto';
import {
  getAllShopByCategories,
  getActiveShopByCategories,
  getShopByCategoryById,
  createShopByCategory,
  updateShopByCategory,
  deleteShopByCategory,
  toggleShopByCategoryStatus,
  reorderShopByCategories,
} from '../controllers/shop-by-category.controller';

const router: Router = Router();

router.get('/active', getActiveShopByCategories);
router.get('/', authenticateToken, requireAdmin, getAllShopByCategories);
router.get('/:id', authenticateToken, requireAdmin, getShopByCategoryById);
router.post('/', authenticateToken, requireAdmin, validate(sectionCreateSchema), createShopByCategory);
router.put('/:id', authenticateToken, requireAdmin, validate(sectionUpdateSchema), updateShopByCategory);
router.delete('/:id', authenticateToken, requireAdmin, deleteShopByCategory);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleShopByCategoryStatus);
router.patch('/reorder', authenticateToken, requireAdmin, validate(sectionReorderSchema), reorderShopByCategories);

export default router;
