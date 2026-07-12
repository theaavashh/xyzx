import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { imageGridCreateSchema, imageGridUpdateSchema, imageGridReorderSchema } from '../dto/image-grid.dto';
import {
  getAllImageGridItems,
  getActiveImageGridItems,
  getImageGridItemById,
  createImageGridItem,
  updateImageGridItem,
  deleteImageGridItem,
  toggleImageGridItemStatus,
  reorderImageGridItems,
} from '../controllers/image-grid.controller';

const router: Router = Router();

router.get('/active', getActiveImageGridItems);
router.get('/', authenticateToken, requireAdmin, getAllImageGridItems);
router.get('/:id', authenticateToken, requireAdmin, getImageGridItemById);
router.post('/', authenticateToken, requireAdmin, validate(imageGridCreateSchema), createImageGridItem);
router.put('/:id', authenticateToken, requireAdmin, validate(imageGridUpdateSchema), updateImageGridItem);
router.delete('/:id', authenticateToken, requireAdmin, deleteImageGridItem);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleImageGridItemStatus);
router.patch('/reorder', authenticateToken, requireAdmin, validate(imageGridReorderSchema), reorderImageGridItems);

export default router;
