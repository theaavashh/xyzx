'use client';

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/utils/api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'product' | 'system' | 'user';
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  unreadCount: number;
}

export function useNotifications() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: () =>
      apiRequest<NotificationsResponse>('/api/v1/notifications'),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest<{ success: boolean }>(
        `/api/v1/notifications/${id}/read`,
        'PATCH',
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () =>
      apiRequest<{ success: boolean }>(
        '/api/v1/notifications/read-all',
        'PATCH',
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAsRead = useCallback(
    (id: string) => {
      markAsReadMutation.mutate(id);
    },
    [markAsReadMutation],
  );

  const markAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

  const notifications = Array.isArray(data?.data) ? data.data : [];
  const unreadCount = data?.unreadCount ?? 0;
  const isAvailable = !error;

  return {
    notifications,
    unreadCount,
    isLoading,
    isAvailable,
    markAsRead,
    markAllAsRead,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
  };
}
