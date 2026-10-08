import { Router } from 'express';
import { optionalAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';
import { addToCartSchema, updateCartItemSchema } from '../dto/cart.dto.js';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeCarts,
} from '../controllers/cart.controller.di.js';

const router: Router = Router();

// Cart works for guests (session id) and authenticated users (accessToken cookie)
router.use(optionalAuth);

router.get('/', getCart);
router.post('/merge', mergeCarts);

// Storefront contract: /cart/add, /cart/item/:itemId, /cart/clear
router.post('/add', validate(addToCartSchema), addToCart);
router.put('/item/:itemId', validate(updateCartItemSchema), updateCartItem);
router.delete('/item/:itemId', removeCartItem);
router.delete('/clear', clearCart);

// Session-in-body contract: /cart, /cart/item, /cart (DELETE)
router.post('/', addToCart);
router.patch('/item', updateCartItem);
router.delete('/item', removeCartItem);
router.delete('/', clearCart);

export default router;
