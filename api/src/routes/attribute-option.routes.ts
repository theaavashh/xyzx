import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { createAttributeOptionSchema, attributeOptionQuerySchema } from '../dto/attribute-option.dto';
import {
  getAttributeOptions,
  createAttributeOption,
  deleteAttributeOption,
} from '../controllers/attribute-option.controller';

const router: Router = Router();

router.get('/', validate(attributeOptionQuerySchema, 'query'), getAttributeOptions);
router.post('/', authenticateToken, validate(createAttributeOptionSchema), createAttributeOption);
router.delete('/:id', authenticateToken, deleteAttributeOption);

export default router;
