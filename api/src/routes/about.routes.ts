import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { aboutSectionCreateSchema, aboutSectionUpdateSchema } from '../dto/about.dto';
import {
  getActiveAboutSection,
  getAllAboutSections,
  getAboutSectionById,
  createAboutSection,
  updateAboutSection,
  deleteAboutSection,
  toggleAboutSectionStatus,
} from '../controllers/about.controller';

const router: Router = Router();

router.get('/active', getActiveAboutSection);
router.get('/', authenticateToken, requireAdmin, getAllAboutSections);
router.get('/:id', authenticateToken, requireAdmin, getAboutSectionById);
router.post('/', authenticateToken, requireAdmin, validate(aboutSectionCreateSchema), createAboutSection);
router.put('/:id', authenticateToken, requireAdmin, validate(aboutSectionUpdateSchema), updateAboutSection);
router.delete('/:id', authenticateToken, requireAdmin, deleteAboutSection);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleAboutSectionStatus);

export default router;
