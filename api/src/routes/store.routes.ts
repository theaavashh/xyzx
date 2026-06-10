import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { storeUpdateSchema } from '../dto/store.dto';
import {
  getPublicStore,
  getStore,
  updateStore,
  toggleStoreStatus,
} from '../controllers/store.controller';

const router: Router = Router();

router.get('/public', getPublicStore);
router.get('/', authenticateToken, requireAdmin, getStore);
router.put('/', authenticateToken, requireAdmin, validate(storeUpdateSchema), updateStore);
router.patch('/toggle', authenticateToken, requireAdmin, toggleStoreStatus);

export default router;
