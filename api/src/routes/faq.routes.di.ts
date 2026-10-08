import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth.js';
import {
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  toggleFAQStatus,
} from '../controllers/faq.controller.di.js';

const router: Router = Router();

// Public routes
router.get('/', getAllFAQs);
router.get('/:id', getFAQById);

// Admin routes
router.post('/', authenticateToken, requireAdmin, createFAQ);
router.put('/:id', authenticateToken, requireAdmin, updateFAQ);
router.delete('/:id', authenticateToken, requireAdmin, deleteFAQ);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleFAQStatus);

export default router;