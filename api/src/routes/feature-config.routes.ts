import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { featureConfigCreateSchema, featureConfigUpdateSchema } from '../dto/feature-config.dto';
import {
  getFeatureConfigs,
  getActiveFeatureConfigs,
  getFeatureConfigById,
  createFeatureConfig,
  updateFeatureConfig,
  deleteFeatureConfig,
  toggleFeatureConfigStatus,
} from '../controllers/feature-config.controller';

const router: Router = Router();

router.get('/active', getActiveFeatureConfigs);
router.get('/', authenticateToken, requireAdmin, getFeatureConfigs);
router.get('/:id', authenticateToken, requireAdmin, getFeatureConfigById);
router.post('/', authenticateToken, requireAdmin, validate(featureConfigCreateSchema), createFeatureConfig);
router.put('/:id', authenticateToken, requireAdmin, validate(featureConfigUpdateSchema), updateFeatureConfig);
router.delete('/:id', authenticateToken, requireAdmin, deleteFeatureConfig);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleFeatureConfigStatus);

export default router;
