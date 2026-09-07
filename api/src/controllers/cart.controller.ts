import type { Request, RequestHandler, Response } from 'express';
import { cartRepository } from '../repositories/cart.repository';
import { asyncHandler, sendBadRequest, sendSuccess } from '../utils';

const getSessionId = (req: Request): string => {
  return (
    req.cookies?.sessionId ||
    (req.headers['x-session-id'] as string) ||
    'anonymous'
  );
};

const formatCartResponse = (cart: { items: Array<{
  id: string;
  product: { id: string; name: string; price: number; images?: unknown; slug: string; productVariants: Array<{ color: string | null; size: string | null; price: number }> };
  quantity: number;
  size?: string | null;
  color?: string | null;
}> }) => {
  const items = cart.items.map((item) => {
    // Try to find the matching variant price
    let price = item.product.price;
    if (item.product.productVariants?.length) {
      const match = item.product.productVariants.find(
        (v) =>
          (!item.color || (v.color && v.color.toLowerCase() === item.color.toLowerCase())) &&
          (!item.size || (v.size && v.size.toLowerCase() === item.size.toLowerCase()))
      );
      if (match && match.price > 0) {
        price = match.price;
      }
    }
    return {
      id: item.id,
      productId: item.product.id,
      name: item.product.name,
      price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      image: (() => {
        const imgs = item.product.images;
        if (Array.isArray(imgs)) return imgs[0] || null;
        if (typeof imgs === 'string') {
          try { const parsed = JSON.parse(imgs); return Array.isArray(parsed) ? parsed[0] || null : null; } catch { return null; }
        }
        return null;
      })(),
      slug: item.product.slug,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
  };
};

export const getCart: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const sessionId = getSessionId(req);
    const userId = req.user?.userId || null;

    const cart = await cartRepository.findOrCreateCart(sessionId, userId);

    sendSuccess(res, formatCartResponse(cart));
  },
);

export const addToCart: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId, quantity, size, color } = req.body;

    if (!productId) {
      sendBadRequest(res, 'Product ID is required');
      return;
    }

    if (!quantity || quantity < 1) {
      sendBadRequest(res, 'Quantity must be at least 1');
      return;
    }

    const sessionId = getSessionId(req);
    const userId = req.user?.userId || null;

    const cart = await cartRepository.addToCart(
      sessionId,
      { productId, quantity, size, color },
      userId,
    );

    sendSuccess(res, formatCartResponse(cart), 'Item added to cart');
  },
);

export const updateCartItem: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const itemId = req.params.itemId as string;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      sendBadRequest(res, 'Invalid quantity');
      return;
    }

    const sessionId = getSessionId(req);
    const userId = req.user?.userId || null;

    const cart = await cartRepository.updateCartItemQuantity(
      itemId,
      quantity,
      sessionId,
      userId,
    );

    sendSuccess(res, formatCartResponse(cart));
  },
);

export const removeCartItem: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const itemId = req.params.itemId as string;
    const sessionId = getSessionId(req);
    const userId = req.user?.userId || null;

    const cart = await cartRepository.removeCartItem(itemId, sessionId, userId);

    sendSuccess(res, formatCartResponse(cart), 'Item removed from cart');
  },
);

export const clearCart: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const sessionId = getSessionId(req);
    const userId = req.user?.userId || null;

    await cartRepository.clearCart(sessionId, userId);

    sendSuccess(res, { items: [], itemCount: 0, subtotal: 0 }, 'Cart cleared');
  },
);
