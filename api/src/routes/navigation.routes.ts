import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { navigationCreateSchema, navigationUpdateSchema, navigationReorderSchema } from '../dto/navigation.dto';
import {
  getNavigationItems,
  getAllNavigationItems,
  getNavigationItemById,
  createNavigationItem,
  updateNavigationItem,
  deleteNavigationItem,
  toggleNavigationItemStatus,
  reorderNavigationItems,
} from '../controllers/navigation.controller';

const router: Router = Router();

router.get('/active', getNavigationItems);
router.get('/', authenticateToken, requireAdmin, getAllNavigationItems);
router.get('/:id', authenticateToken, requireAdmin, getNavigationItemById);
router.post('/', authenticateToken, requireAdmin, validate(navigationCreateSchema), createNavigationItem);
router.put('/:id', authenticateToken, requireAdmin, validate(navigationUpdateSchema), updateNavigationItem);
router.delete('/:id', authenticateToken, requireAdmin, deleteNavigationItem);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleNavigationItemStatus);
router.patch('/reorder', authenticateToken, requireAdmin, validate(navigationReorderSchema), reorderNavigationItems);

export default router;
