import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { contentCreateSchema, contentUpsertSchema, contentUpdateSchema } from '../dto/content.dto';
import {
  getContentPages,
  getContentPageBySlug,
  getContentPageById,
  createContentPage,
  updateContentPage,
  updateContentPageBySlug,
  upsertContentBySlug,
  deleteContentPage,
  deleteContentPageBySlug,
  toggleContentPageStatus,
  toggleContentPageStatusBySlug,
} from '../controllers/content.controller';

const router: Router = Router();

router.get('/slug/:slug', getContentPageBySlug);
router.get('/', authenticateToken, requireAdmin, getContentPages);
router.post('/', authenticateToken, requireAdmin, validate(contentCreateSchema), createContentPage);
router.post('/:slug', authenticateToken, requireAdmin, validate(contentUpsertSchema), upsertContentBySlug);
router.get('/:id', authenticateToken, requireAdmin, getContentPageById);
router.put('/:id', authenticateToken, requireAdmin, validate(contentUpdateSchema), updateContentPage);
router.put('/slug/:slug', authenticateToken, requireAdmin, validate(contentUpdateSchema), updateContentPageBySlug);
router.delete('/:id', authenticateToken, requireAdmin, deleteContentPage);
router.delete('/slug/:slug', authenticateToken, requireAdmin, deleteContentPageBySlug);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleContentPageStatus);
router.patch('/slug/:slug/toggle', authenticateToken, requireAdmin, toggleContentPageStatusBySlug);

export default router;
