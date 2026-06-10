import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { contactCreateSchema } from '../dto/contact.dto';
import {
  submitContact,
  getSubmissions,
  getSubmission,
  deleteSubmission,
  markAsRead,
} from '../controllers/contact.controller';

const router: Router = Router();

router.post('/submit', validate(contactCreateSchema), submitContact);
router.get('/submissions', authenticateToken, requireAdmin, getSubmissions);
router.get('/submissions/:id', authenticateToken, requireAdmin, getSubmission);
router.delete('/submissions/:id', authenticateToken, requireAdmin, deleteSubmission);
router.patch('/submissions/:id/read', authenticateToken, requireAdmin, markAsRead);

export default router;
