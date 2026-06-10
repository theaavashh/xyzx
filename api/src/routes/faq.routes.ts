import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { faqCreateSchema, faqUpdateSchema } from '../dto/faq.dto';
import {
  getFAQs,
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  toggleFAQStatus,
} from '../controllers/faq.controller';

const router: Router = Router();

router.get('/', getFAQs);
router.get('/admin', authenticateToken, requireAdmin, getAllFAQs);
router.get('/:id', authenticateToken, requireAdmin, getFAQById);
router.post('/', authenticateToken, requireAdmin, validate(faqCreateSchema), createFAQ);
router.put('/:id', authenticateToken, requireAdmin, validate(faqUpdateSchema), updateFAQ);
router.delete('/:id', authenticateToken, requireAdmin, deleteFAQ);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleFAQStatus);

export default router;
