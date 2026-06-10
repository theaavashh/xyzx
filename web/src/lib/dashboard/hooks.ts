import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as dashboardApi from './api';
import type { PaginationParams, Address, WishlistItem } from './types';

const QUERY_KEYS = {
  dashboard: {
    all: ['dashboard'] as const,
    stats: ['dashboard', 'stats'] as const,
  },
  orders: {
    all: ['orders'] as const,
    lists: () => [...QUERY_KEYS.orders.all, 'list'] as const,
    list: (params: PaginationParams | undefined) => [...QUERY_KEYS.orders.lists(), { page: params?.page, limit: params?.limit }] as const,
    details: () => [...QUERY_KEYS.orders.all, 'detail'] as const,
    detail: (id: string) => [...QUERY_KEYS.orders.details(), id] as const,
  },
  returns: {
    all: ['returns'] as const,
    lists: () => [...QUERY_KEYS.returns.all, 'list'] as const,
    list: (params: PaginationParams | undefined) => [...QUERY_KEYS.returns.lists(), { page: params?.page, limit: params?.limit }] as const,
  },
  cancellations: {
    all: ['cancellations'] as const,
    lists: () => [...QUERY_KEYS.cancellations.all, 'list'] as const,
    list: (params: PaginationParams | undefined) => [...QUERY_KEYS.cancellations.lists(), { page: params?.page, limit: params?.limit }] as const,
  },
  wishlist: {
    all: ['wishlist'] as const,
    lists: () => [...QUERY_KEYS.wishlist.all, 'list'] as const,
    list: (params: PaginationParams | undefined) => [...QUERY_KEYS.wishlist.lists(), { page: params?.page, limit: params?.limit }] as const,
  },
  addresses: {
    all: ['addresses'] as const,
    lists: () => [...QUERY_KEYS.addresses.all, 'list'] as const,
  },
  auth: {
    profile: ['auth', 'profile'] as const,
  },
};

const DEFAULT_STALE_TIME = 5 * 60 * 1000;
const DEFAULT_GC_TIME = 10 * 60 * 1000;
const SHORT_STALE_TIME = 2 * 60 * 1000;

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  return fallback;
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard.stats,
    queryFn: dashboardApi.fetchDashboardStats,
    staleTime: SHORT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

export const useOrders = (params?: PaginationParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.orders.list(params),
    queryFn: () => dashboardApi.fetchOrders(params),
    staleTime: SHORT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

export const useOrderById = (orderId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.orders.detail(orderId),
    queryFn: () => dashboardApi.fetchOrderById(orderId),
    enabled: !!orderId,
    staleTime: SHORT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

export const useReturns = (params?: PaginationParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.returns.list(params),
    queryFn: () => dashboardApi.fetchReturns(params),
    staleTime: SHORT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

export const useCancellations = (params?: PaginationParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.cancellations.list(params),
    queryFn: () => dashboardApi.fetchCancellations(params),
    staleTime: SHORT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

export const useWishlist = (params?: PaginationParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.wishlist.list(params),
    queryFn: () => dashboardApi.fetchWishlist(params),
    staleTime: SHORT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => dashboardApi.addToWishlist(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.wishlist.all });

      const previousWishlist = queryClient.getQueryData(QUERY_KEYS.wishlist.lists());

      queryClient.setQueryData(QUERY_KEYS.wishlist.lists(), (old: { data: WishlistItem[] } | undefined) => {
        if (!old) return old;
        return {
          ...old,
          data: [...old.data, {
            id: productId,
            productId,
            name: '',
            price: 0,
            image: '',
            category: '',
            inStock: true,
            addedAt: new Date().toISOString(),
          }],
        };
      });

      return { previousWishlist };
    },
    onError: (error, _productId, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(QUERY_KEYS.wishlist.lists(), context.previousWishlist);
      }
      toast.error(getErrorMessage(error, 'Failed to add to wishlist'));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wishlist.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.stats });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => dashboardApi.removeFromWishlist(itemId),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.wishlist.all });

      const previousWishlist = queryClient.getQueryData(QUERY_KEYS.wishlist.lists());

      queryClient.setQueryData(QUERY_KEYS.wishlist.lists(), (old: { data: WishlistItem[] } | undefined) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((item) => item.id !== itemId),
        };
      });

      return { previousWishlist };
    },
    onError: (error, _itemId, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(QUERY_KEYS.wishlist.lists(), context.previousWishlist);
      }
      toast.error(getErrorMessage(error, 'Failed to remove from wishlist'));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wishlist.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.stats });
    },
  });
};

export const useAddresses = () => {
  return useQuery({
    queryKey: QUERY_KEYS.addresses.lists(),
    queryFn: dashboardApi.fetchAddresses,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dashboardApi.addAddress,
    onSuccess: () => {
      toast.success('Address added successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.addresses.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to add address'));
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Address> }) =>
      dashboardApi.updateAddress(id, data),
    onSuccess: () => {
      toast.success('Address updated successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.addresses.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update address'));
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dashboardApi.deleteAddress,
    onSuccess: () => {
      toast.success('Address deleted successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.addresses.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete address'));
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dashboardApi.updateProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.profile });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update profile'));
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: dashboardApi.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to change password'));
    },
  });
};

export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: dashboardApi.requestPasswordReset,
    onSuccess: () => {
      toast.success('Password reset link sent to your email');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to send reset link'));
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: dashboardApi.resetPassword,
    onSuccess: () => {
      toast.success('Password reset successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to reset password'));
    },
  });
};
