import { Prisma } from '@prisma/client';

export interface CartItemInput {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface CartWithItems {
  id: string;
  sessionId: string;
  userId: string | null;
  items: Array<{
    id: string;
    quantity: number;
    size: string | null;
    color: string | null;
    product: {
      id: string;
      name: string;
      price: number;
      images: Prisma.JsonValue;
      slug: string;
      productVariants: Array<{
        color: string | null;
        size: string | null;
        price: number;
      }>;
    };
  }>;
}

export interface ICartRepository {
  findOrCreateCart(sessionId: string, userId?: string | null): Promise<CartWithItems>;

  addToCart(
    sessionId: string,
    item: CartItemInput,
    userId?: string | null
  ): Promise<CartWithItems>;

  updateCartItemQuantity(
    cartItemId: string,
    quantity: number,
    sessionId: string,
    userId?: string | null
  ): Promise<CartWithItems>;

  removeCartItem(
    cartItemId: string,
    sessionId: string,
    userId?: string | null
  ): Promise<CartWithItems>;

  clearCart(sessionId: string, userId?: string | null): Promise<void>;

  mergeCarts(fromSessionId: string, toUserId: string): Promise<CartWithItems>;
}

export const CART_REPOSITORY_TOKEN = 'CART_REPOSITORY';