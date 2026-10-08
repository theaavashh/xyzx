import type { Request } from 'express';
import type { CartWithItems } from '../interfaces/repositories/cart.repository.js';

const SESSION_COOKIE_NAME = 'sessionId';
const SESSION_HEADER_NAME = 'x-session-id';

export interface FormattedCartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string | null;
  color: string | null;
  image: string | null;
  slug: string;
}

export interface FormattedCart {
  items: FormattedCartItem[];
  itemCount: number;
  subtotal: number;
}

export const emptyCartResponse = (): FormattedCart => ({
  items: [],
  itemCount: 0,
  subtotal: 0,
});

export const getSessionId = (req: Request): string | null => {
  const body = req.body as { sessionId?: unknown } | undefined;
  if (typeof body?.sessionId === 'string' && body.sessionId) {
    return body.sessionId;
  }

  const cookies = req.cookies as Record<string, string> | undefined;
  if (cookies?.[SESSION_COOKIE_NAME]) {
    return cookies[SESSION_COOKIE_NAME];
  }

  const headerSessionId = req.get(SESSION_HEADER_NAME);
  if (headerSessionId) {
    return headerSessionId;
  }

  const querySessionId = req.query.sessionId;
  if (typeof querySessionId === 'string' && querySessionId) {
    return querySessionId;
  }

  return null;
};

export const formatCartResponse = (cart: CartWithItems): FormattedCart => {
  const items: FormattedCartItem[] = cart.items.map((item) => {
    let price = item.product.price;
    const variants = item.product.productVariants ?? [];
    if (variants.length) {
      const match = variants.find(
        (v) =>
          (!item.color ||
            (v.color && v.color.toLowerCase() === item.color.toLowerCase())) &&
          (!item.size ||
            (v.size && v.size.toLowerCase() === item.size.toLowerCase())),
      );
      if (match && match.price > 0) {
        price = match.price;
      }
    }

    const images = item.product.images;
    let image: string | null = null;
    if (Array.isArray(images)) {
      image = (images[0] as string) || null;
    } else if (typeof images === 'string') {
      try {
        const parsed: unknown = JSON.parse(images);
        if (Array.isArray(parsed)) {
          image = (parsed[0] as string) || null;
        }
      } catch {
        image = null;
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
      image,
      slug: item.product.slug,
    };
  });

  return {
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };
};
