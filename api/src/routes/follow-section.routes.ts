import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { followSectionCreateSchema, followSectionUpdateSchema } from '../dto/follow-section.dto';
import {
  getFollowSection,
  getAllFollowSections,
  getFollowSectionById,
  createFollowSection,
  updateFollowSection,
  deleteFollowSection,
  toggleFollowSectionStatus,
} from '../controllers/follow-section.controller';

const router: Router = Router();

router.get('/active', getFollowSection);
router.get('/', authenticateToken, requireAdmin, getAllFollowSections);
router.get('/:id', authenticateToken, requireAdmin, getFollowSectionById);
router.post('/', authenticateToken, requireAdmin, validate(followSectionCreateSchema), createFollowSection);
router.put('/:id', authenticateToken, requireAdmin, validate(followSectionUpdateSchema), updateFollowSection);
router.delete('/:id', authenticateToken, requireAdmin, deleteFollowSection);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleFollowSectionStatus);

export default router;
