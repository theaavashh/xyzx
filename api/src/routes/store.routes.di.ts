import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth.js';
import {
  getStore,
  createStore,
  updateStore,
  toggleStoreStatus,
} from '../controllers/store.controller.di.js';

const router: Router = Router();

// Public routes
router.get('/', getStore);

// Admin routes
router.post('/', authenticateToken, requireAdmin, createStore);
router.put('/:id', authenticateToken, requireAdmin, updateStore);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleStoreStatus);

export default router;