import { Router } from 'express';
import { validate } from '../middlewares/validation';
import { addToCartSchema, updateCartItemSchema } from '../dto/cart.dto';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cart.controller';

const router: Router = Router();

router.get('/', getCart);
router.post('/add', validate(addToCartSchema), addToCart);
router.put('/item/:itemId', validate(updateCartItemSchema), updateCartItem);
router.delete('/item/:itemId', removeCartItem);
router.delete('/clear', clearCart);

export default router;
