import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { shortDescriptionUpdateSchema } from '../dto/short-description.dto';
import {
  getShortDescription,
  updateShortDescription,
} from '../controllers/short-description.controller';

const router: Router = Router();

router.get('/', getShortDescription);
router.put(
  '/',
  authenticateToken,
  requireAdmin,
  validate(shortDescriptionUpdateSchema),
  updateShortDescription,
);

export default router;
