import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { createProductSchema, updateProductSchema, productQuerySchema, bulkDeleteSchema } from '../dto/product.dto';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
} from '../controllers/product.controller';

const router: Router = Router();

router.get('/', validate(productQuerySchema, 'query'), getProducts);
router.get('/:id', getProductById);
router.post('/', authenticateToken, validate(createProductSchema), createProduct);
router.put('/:id', authenticateToken, validate(updateProductSchema), updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);
router.post('/bulk-delete', authenticateToken, validate(bulkDeleteSchema), bulkDeleteProducts);

export default router;
