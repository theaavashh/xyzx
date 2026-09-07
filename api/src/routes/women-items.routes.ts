import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { womenItemsUpdateSchema } from '../dto/women-items.dto';
import {
  getWomenItemsConfig,
  updateWomenItemsConfig,
} from '../controllers/women-items.controller';

const router: Router = Router();

router.get('/', getWomenItemsConfig);
router.put(
  '/',
  authenticateToken,
  requireAdmin,
  validate(womenItemsUpdateSchema),
  updateWomenItemsConfig,
);

export default router;
