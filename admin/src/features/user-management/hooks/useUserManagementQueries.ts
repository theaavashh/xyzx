'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiWrapper } from '@/services/apiClient';
import type { User, UserFormData } from '../types';

const USERS_KEY = ['users'];

export function useUsers() {
  return useQuery({
    queryKey: USERS_KEY,
    queryFn: () => apiWrapper.get<User[]>('/api/v1/users'),
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UserFormData) =>
      apiWrapper.post('/api/v1/users', {
        email: data.email,
        name: data.name,
        password: data.password,
        role: data.role,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEY });
      toast.success('User created successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserFormData> }) =>
      apiWrapper.put(`/api/v1/users/${id}`, {
        email: data.email,
        name: data.name,
        role: data.role,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEY });
      toast.success('User updated successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiWrapper.delete(`/api/v1/users/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEY });
      toast.success('User deleted successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useToggleUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiWrapper.patch(`/api/v1/users/${id}/toggle`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEY });
      toast.success('User status updated');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: 'admin' | 'user' }) =>
      apiWrapper.patch(`/api/v1/users/${id}/role`, { role }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEY });
      toast.success('User role updated');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
