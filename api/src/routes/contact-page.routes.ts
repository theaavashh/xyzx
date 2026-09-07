import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { contactPageUpdateSchema } from '../dto/contact-page.dto';
import {
  getPublicContactPage,
  getContactPage,
  updateContactPage,
} from '../controllers/contact-page.controller';

const router: Router = Router();

router.get('/public', getPublicContactPage);
router.get('/', authenticateToken, requireAdmin, getContactPage);
router.put('/', authenticateToken, requireAdmin, validate(contactPageUpdateSchema), updateContactPage);

export default router;
