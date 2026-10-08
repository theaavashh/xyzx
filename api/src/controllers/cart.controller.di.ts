import type { Request, RequestHandler, Response } from 'express';
import { resolveCartRepository } from '../di/index.js';
import { CartItemInput } from '../interfaces/repositories/cart.repository.js';
import {
  asyncHandler,
  emptyCartResponse,
  formatCartResponse,
  getSessionId,
  sendBadRequest,
  sendNotFound,
  sendSuccess,
} from '../utils/index.js';

interface AddToCartBody {
  sessionId?: string;
  userId?: string;
  item?: CartItemInput;
  productId?: string;
  quantity?: number;
  size?: string;
  color?: string;
}

const resolveUserId = (req: Request, fallback?: string): string | undefined =>
  req.user?.userId ?? fallback;

export const getCart: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const sessionId = getSessionId(req);

    if (!sessionId) {
      sendSuccess(res, emptyCartResponse());
      return;
    }

    const cartRepository = await resolveCartRepository();
    const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
    const cart = await cartRepository.findOrCreateCart(
      sessionId,
      resolveUserId(req, queryUserId),
    );
    sendSuccess(res, formatCartResponse(cart));
  },
);

export const addToCart: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const body: AddToCartBody = req.body ?? {};
    const item: CartItemInput = body.item ?? {
      productId: body.productId ?? '',
      quantity: body.quantity ?? 0,
      size: body.size,
      color: body.color,
    };

    if (!item.productId) {
      sendBadRequest(res, 'Product ID is required');
      return;
    }

    if (typeof item.quantity !== 'number' || item.quantity < 1) {
      sendBadRequest(res, 'Quantity must be at least 1');
      return;
    }

    const sessionId = getSessionId(req) ?? 'anonymous';
    const cartRepository = await resolveCartRepository();
    const cart = await cartRepository.addToCart(
      sessionId,
      item,
      resolveUserId(req, body.userId),
    );
    sendSuccess(res, formatCartResponse(cart), 'Item added to cart');
  },
);

export const updateCartItem: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const body = req.body as { cartItemId?: string; quantity?: unknown };
    const cartItemId = (req.params.itemId as string | undefined) ?? body.cartItemId;
    const quantity = body.quantity;

    if (!cartItemId) {
      sendBadRequest(res, 'Cart item ID is required');
      return;
    }

    if (typeof quantity !== 'number' || quantity < 0) {
      sendBadRequest(res, 'Quantity must be a number of 0 or more');
      return;
    }

    const sessionId = getSessionId(req) ?? 'anonymous';
    const cartRepository = await resolveCartRepository();

    try {
      const cart = await cartRepository.updateCartItemQuantity(
        cartItemId,
        quantity,
        sessionId,
        resolveUserId(req),
      );
      sendSuccess(res, formatCartResponse(cart), 'Cart updated');
    } catch {
      sendNotFound(res, 'Cart item not found');
    }
  },
);

export const removeCartItem: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const body = req.body as { cartItemId?: string };
    const cartItemId = (req.params.itemId as string | undefined) ?? body.cartItemId;

    if (!cartItemId) {
      sendBadRequest(res, 'Cart item ID is required');
      return;
    }

    const sessionId = getSessionId(req) ?? 'anonymous';
    const cartRepository = await resolveCartRepository();

    try {
      const cart = await cartRepository.removeCartItem(
        cartItemId,
        sessionId,
        resolveUserId(req),
      );
      sendSuccess(res, formatCartResponse(cart), 'Item removed from cart');
    } catch {
      sendNotFound(res, 'Cart item not found');
    }
  },
);

export const clearCart: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const sessionId = getSessionId(req) ?? 'anonymous';
    const cartRepository = await resolveCartRepository();
    await cartRepository.clearCart(sessionId, resolveUserId(req));
    sendSuccess(res, emptyCartResponse(), 'Cart cleared');
  },
);

export const mergeCarts: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { fromSessionId, toUserId } = req.body as {
      fromSessionId?: string;
      toUserId?: string;
    };

    if (!fromSessionId || !toUserId) {
      sendBadRequest(res, 'fromSessionId and toUserId are required');
      return;
    }

    const cartRepository = await resolveCartRepository();
    const cart = await cartRepository.mergeCarts(fromSessionId, toUserId);
    sendSuccess(res, formatCartResponse(cart), 'Carts merged');
  },
);
