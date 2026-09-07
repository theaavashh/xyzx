import { Prisma } from '@prisma/client';
import { prisma } from '../lib/database';

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

export const findOrCreateCart = async (
  sessionId: string,
  userId?: string | null,
): Promise<CartWithItems> => {
  let cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        sessionId,
        userId: userId || null,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
                slug: true,
                productVariants: {
                  select: {
                    color: true,
                    size: true,
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  return cart as unknown as CartWithItems;
};

export const addToCart = async (
  sessionId: string,
  item: CartItemInput,
  userId?: string | null,
): Promise<CartWithItems> => {
  const cart = await findOrCreateCart(sessionId, userId);

  await prisma.cartItem.upsert({
    where: {
      cartId_productId_size_color: {
        cartId: cart.id,
        productId: item.productId,
        size: item.size ?? '',
        color: item.color ?? '',
      },
    },
    update: {
      quantity: { increment: item.quantity },
    },
    create: {
      cartId: cart.id,
      productId: item.productId,
      quantity: item.quantity,
      size: item.size ?? '',
      color: item.color ?? '',
    },
  });

  return findOrCreateCart(sessionId, userId);
};

export const updateCartItemQuantity = async (
  cartItemId: string,
  quantity: number,
  sessionId: string,
  userId?: string | null,
): Promise<CartWithItems> => {
  const cart = await findOrCreateCart(sessionId, userId);
  const cartItem = cart.items.find((i) => i.id === cartItemId);

  if (!cartItem) {
    throw new Error('Cart item not found');
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  return findOrCreateCart(sessionId, userId);
};

export const removeCartItem = async (
  cartItemId: string,
  sessionId: string,
  userId?: string | null,
): Promise<CartWithItems> => {
  await prisma.cartItem.delete({ where: { id: cartItemId } });
  return findOrCreateCart(sessionId, userId);
};

export const clearCart = async (
  sessionId: string,
  userId?: string | null,
): Promise<void> => {
  const cart = await findOrCreateCart(sessionId, userId);
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
};

export const mergeCarts = async (
  fromSessionId: string,
  toUserId: string,
): Promise<CartWithItems> => {
  const sessionCart = await prisma.cart.findFirst({
    where: { sessionId: fromSessionId },
    include: { items: true },
  });

  if (!sessionCart || sessionCart.items.length === 0) {
    return findOrCreateCart(fromSessionId, toUserId);
  }

  const userCart = await findOrCreateCart(fromSessionId, toUserId);

  for (const item of sessionCart.items) {
    await prisma.cartItem.upsert({
      where: {
        cartId_productId_size_color: {
          cartId: userCart.id,
          productId: item.productId,
          size: (item.size ?? null) as string,
          color: (item.color ?? null) as string,
        },
      },
      update: {
        quantity: { increment: item.quantity },
      },
      create: {
        cartId: userCart.id,
        productId: item.productId,
        quantity: item.quantity,
        size: item.size ?? null,
        color: item.color ?? null,
      },
    });
  }

  await prisma.cart.delete({ where: { id: sessionCart.id } });

  return findOrCreateCart(fromSessionId, toUserId);
};

export const cartRepository = {
  findOrCreateCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  mergeCarts,
};
