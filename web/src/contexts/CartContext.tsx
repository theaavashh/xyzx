'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

export interface CartItem {
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

interface CartData {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isLoading: boolean;
  addToCart: (productId: string, quantity: number, size?: string, color?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

async function fetchCart(): Promise<ApiResponse<CartData>> {
  return api.get<ApiResponse<CartData>>('/api/v1/cart');
}

export function CartProvider({ children }: CartProviderProps) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
    retry: 1,
    staleTime: 30 * 1000,
  });

  const addMutation = useMutation({
    mutationFn: async (vars: { productId: string; quantity: number; size?: string; color?: string }) => {
      return api.post<ApiResponse<CartData>>('/api/v1/cart/add', vars);
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.setQueryData<ApiResponse<CartData>>(['cart'], res);
        toast.success('Added to cart');
      }
    },
    onError: () => {
      toast.error('Failed to add item to cart');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      return api.put<ApiResponse<CartData>>(`/api/v1/cart/item/${itemId}`, { quantity });
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.setQueryData<ApiResponse<CartData>>(['cart'], res);
      }
    },
    onError: () => {
      toast.error('Failed to update quantity');
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (itemId: string) => {
      return api.delete<ApiResponse<CartData>>(`/api/v1/cart/item/${itemId}`);
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.setQueryData<ApiResponse<CartData>>(['cart'], res);
        toast.success('Removed from cart');
      }
    },
    onError: () => {
      toast.error('Failed to remove item');
    },
  });

  const clearMutation = useMutation({
    mutationFn: async () => {
      return api.delete<ApiResponse<void>>('/api/v1/cart/clear');
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.setQueryData<ApiResponse<CartData>>(['cart'], {
          success: true,
          data: { items: [], itemCount: 0, subtotal: 0 },
        });
        toast.success('Cart cleared');
      }
    },
    onError: () => {
      toast.error('Failed to clear cart');
    },
  });

  const addToCart = async (productId: string, quantity: number, size?: string, color?: string) => {
    await addMutation.mutateAsync({ productId, quantity, size, color });
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    await updateMutation.mutateAsync({ itemId, quantity });
  };

  const removeItem = async (itemId: string) => {
    await removeMutation.mutateAsync(itemId);
  };

  const clearCart = async () => {
    await clearMutation.mutateAsync();
  };

  const refreshCart = () => {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
  };

  return (
    <CartContext.Provider
      value={{
        items: data?.data?.items || [],
        itemCount: data?.data?.itemCount || 0,
        subtotal: data?.data?.subtotal || 0,
        isLoading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
