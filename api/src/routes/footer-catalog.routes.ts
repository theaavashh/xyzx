import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { sectionCreateSchema, sectionUpdateSchema, sectionReorderSchema } from '../dto/section.dto';
import {
  getFooterCatalogs,
  getAllFooterCatalogs,
  getFooterCatalogById,
  createFooterCatalog,
  updateFooterCatalog,
  deleteFooterCatalog,
  toggleFooterCatalogStatus,
  reorderFooterCatalogs,
} from '../controllers/footer-catalog.controller';

const router: Router = Router();

router.get('/active', getFooterCatalogs);
router.get('/', authenticateToken, requireAdmin, getAllFooterCatalogs);
router.get('/:id', authenticateToken, requireAdmin, getFooterCatalogById);
router.post('/', authenticateToken, requireAdmin, validate(sectionCreateSchema), createFooterCatalog);
router.put('/:id', authenticateToken, requireAdmin, validate(sectionUpdateSchema), updateFooterCatalog);
router.delete('/:id', authenticateToken, requireAdmin, deleteFooterCatalog);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleFooterCatalogStatus);
router.patch('/reorder', authenticateToken, requireAdmin, validate(sectionReorderSchema), reorderFooterCatalogs);

export default router;
