import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import {
  shippingItemCreateSchema,
  shippingItemUpdateSchema,
  shippingSettingsUpdateSchema,
} from '../dto/shipping.dto';
import {
  getPublicShipping,
  getShippingItems,
  getShippingItem,
  createShippingItem,
  updateShippingItem,
  deleteShippingItem,
  toggleShippingItem,
  getSettings,
  updateSettings,
} from '../controllers/shipping.controller';

const router: Router = Router();

router.get('/public', getPublicShipping);

router.get('/', authenticateToken, requireAdmin, getShippingItems);
router.get('/settings', authenticateToken, requireAdmin, getSettings);
router.put('/settings', authenticateToken, requireAdmin, validate(shippingSettingsUpdateSchema), updateSettings);
router.get('/:id', authenticateToken, requireAdmin, getShippingItem);
router.post('/', authenticateToken, requireAdmin, validate(shippingItemCreateSchema), createShippingItem);
router.put('/:id', authenticateToken, requireAdmin, validate(shippingItemUpdateSchema), updateShippingItem);
router.delete('/:id', authenticateToken, requireAdmin, deleteShippingItem);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleShippingItem);

export default router;
