import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth.js';
import {
  getShippingItems,
  getShippingItemById,
  createShippingItem,
  updateShippingItem,
  deleteShippingItem,
  toggleShippingItemStatus,
  getShippingSettings,
  updateShippingSettings,
} from '../controllers/shipping.controller.di.js';

const router: Router = Router();

// Public routes
router.get('/', getShippingItems);
router.get('/settings', getShippingSettings);
router.get('/:id', getShippingItemById);

// Admin routes
router.post('/', authenticateToken, requireAdmin, createShippingItem);
router.put('/:id', authenticateToken, requireAdmin, updateShippingItem);
router.delete('/:id', authenticateToken, requireAdmin, deleteShippingItem);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleShippingItemStatus);
router.put('/settings', authenticateToken, requireAdmin, updateShippingSettings);

export default router;