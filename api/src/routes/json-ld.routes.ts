import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { jsonLdSchema } from '../dto/settings.dto';
import {
  getJsonLdTemplates,
  createJsonLdTemplate,
  updateJsonLdTemplate,
  deleteJsonLdTemplate,
  getAvailableTypes,
  getAvailablePages,
} from '../controllers/json-ld.controller';

const router: Router = Router();

router.get('/types', getAvailableTypes);
router.get('/pages', getAvailablePages);
router.get('/', getJsonLdTemplates);
router.post('/', authenticateToken, requireAdmin, validate(jsonLdSchema), createJsonLdTemplate);
router.put('/:id', authenticateToken, requireAdmin, validate(jsonLdSchema), updateJsonLdTemplate);
router.delete('/:id', authenticateToken, requireAdmin, deleteJsonLdTemplate);

export default router;
