import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { getFooterSections, getAllFooterSections, getFooterSectionById, createFooterSection, updateFooterSection, deleteFooterSection, toggleFooterSectionStatus, reorderFooterSections } from '../controllers/footer-section.controller';
import { validate } from '../middlewares/validation';
import { sectionCreateSchema, sectionUpdateSchema, sectionReorderSchema } from '../dto/section.dto';

const router: Router = Router();

router.get('/active', getFooterSections);
router.get('/', authenticateToken, requireAdmin, getAllFooterSections);
router.get('/:id', authenticateToken, requireAdmin, getFooterSectionById);
router.post('/', authenticateToken, requireAdmin, validate(sectionCreateSchema), createFooterSection);
router.put('/:id', authenticateToken, requireAdmin, validate(sectionUpdateSchema), updateFooterSection);
router.delete('/:id', authenticateToken, requireAdmin, deleteFooterSection);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleFooterSectionStatus);
router.patch('/reorder', authenticateToken, requireAdmin, validate(sectionReorderSchema), reorderFooterSections);

export default router;
