import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { storeLocationCreateSchema, storeLocationUpdateSchema } from '../dto/store-location.dto';
import {
  getPublicStoreLocations,
  getAllStoreLocations,
  getStoreLocationById,
  createStoreLocation,
  updateStoreLocation,
  deleteStoreLocation,
  toggleStoreLocationStatus,
} from '../controllers/store-location.controller';

const router: Router = Router();

// Public read-only list for storefront
router.get('/public', getPublicStoreLocations);

// Admin-managed
router.get('/', authenticateToken, requireAdmin, getAllStoreLocations);
router.get('/:id', authenticateToken, requireAdmin, getStoreLocationById);
router.post('/', authenticateToken, requireAdmin, validate(storeLocationCreateSchema), createStoreLocation);
router.put('/:id', authenticateToken, requireAdmin, validate(storeLocationUpdateSchema), updateStoreLocation);
router.delete('/:id', authenticateToken, requireAdmin, deleteStoreLocation);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleStoreLocationStatus);

export default router;
