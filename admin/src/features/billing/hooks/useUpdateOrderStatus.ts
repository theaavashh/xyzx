import { useMutation } from '@tanstack/react-query';
import { apiWrapper } from '@/services/apiClient';
import type { Order } from '../types';

export interface UpdateOrderStatusInput {
  id: string;
  status: string;
  adminNotes?: string;
}

export function useUpdateOrderStatus() {
  return useMutation({
    mutationFn: ({ id, status, adminNotes }: UpdateOrderStatusInput) =>
      apiWrapper.patch<{ success: boolean; data: Order }>(
        `/api/v1/orders/${id}/status`,
        {
          status,
          ...(adminNotes ? { adminNotes } : {}),
        },
      ),
  });
}
