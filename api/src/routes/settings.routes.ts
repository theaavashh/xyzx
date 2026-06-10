import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { settingsUpdateSchema } from '../dto/settings.dto';
import {
  getSettings,
  updateSettings,
  resetSettings,
} from '../controllers/settings.controller';

const router: Router = Router();

router.use(authenticateToken);

router.get('/', getSettings);
router.put('/', requireAdmin, validate(settingsUpdateSchema), updateSettings);
router.patch('/', requireAdmin, validate(settingsUpdateSchema), updateSettings);
router.post('/reset', requireAdmin, resetSettings);

export default router;
