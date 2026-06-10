'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api, { uploadFile } from '@/services/apiClient';
import { type CategoryFormData } from '@/schemas/categorySchema';
import { getErrorMessage } from '@/types';
import type { Category, CategoryApiResponse, UploadImageResponse } from '../types';

const CATEGORIES_KEY = ['categories'];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export function getFullImageUrl(imagePath: string): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_BASE_URL}${imagePath}`;
}

function transformCategory(apiCategory: CategoryApiResponse): Category {
  return {
    id: apiCategory.id,
    name: apiCategory.name,
    image: apiCategory.image || '',
    createdAt: (apiCategory.createdAt ? new Date(apiCategory.createdAt) : new Date()).toISOString().split('T')[0],
    status: apiCategory.isActive ? 'active' : 'inactive',
    internalLink: apiCategory.internalLink || undefined,
    metaTitle: apiCategory.metaTitle || undefined,
    metaDescription: apiCategory.metaDescription || undefined,
    keywords: apiCategory.keywords || undefined,
  };
}

function onError(err: unknown, label: string) {
  const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || getErrorMessage(err) || `Failed to ${label}`;
  toast.error(message);
}

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: async () => {
      const res = await api.get('/api/v1/categories');
      if (res.data.success) {
        const data = res.data.data;
        if (!data) return [] as Category[];
        const arr = Array.isArray(data) ? data : [];
        return arr.map(transformCategory) as Category[];
      }
      throw new Error(res.data.message || 'Failed to fetch categories');
    },
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const res = await api.post('/api/v1/categories', {
        name: data.name,
        image: data.image || '',
        internalLink: data.internalLink,
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        keywords: data.keywords || '',
      });
      if (!res.data.success) throw new Error(res.data.message || 'Failed to create category');
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CATEGORIES_KEY });
      toast.success('Category created successfully!');
    },
    onError: (e) => onError(e, 'create category'),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CategoryFormData }) => {
      const res = await api.put(`/api/v1/categories/${id}`, {
        name: data.name,
        image: data.image || '',
        internalLink: data.internalLink,
        isActive: data.status === 'active',
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        keywords: data.keywords || '',
      });
      if (!res.data.success) throw new Error(res.data.message || 'Failed to update category');
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CATEGORIES_KEY });
      toast.success('Category updated successfully!');
    },
    onError: (e) => onError(e, 'update category'),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/v1/categories/${id}`);
      if (!res.data.success) throw new Error(res.data.message || 'Failed to delete category');
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CATEGORIES_KEY });
      toast.success('Category deleted successfully!');
    },
    onError: (e) => onError(e, 'delete category'),
  });
}

export function useBulkStatusToggle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ ids, categories }: { ids: string[]; categories: Category[] }) => {
      const selected = categories.filter((c) => ids.includes(c.id));
      const allActive = selected.every((c) => c.status === 'active');
      const newStatus = allActive ? 'inactive' : 'active';
      await Promise.all(
        selected.map((c) =>
          api.put(`/api/v1/categories/${c.id}`, {
            name: c.name,
            image: c.image,
            internalLink: c.internalLink || '',
            isActive: newStatus === 'active',
            metaTitle: c.metaTitle || '',
            metaDescription: c.metaDescription || '',
            keywords: c.keywords || '',
          }),
        ),
      );
      return { count: ids.length, newStatus };
    },
    onSuccess: ({ count, newStatus }) => {
      qc.invalidateQueries({ queryKey: CATEGORIES_KEY });
      toast.success(`${count} categories ${newStatus === 'active' ? 'activated' : 'deactivated'}!`);
    },
    onError: (e) => onError(e, 'update categories'),
  });
}

export function useBulkDeleteCategories() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => api.delete(`/api/v1/categories/${id}`)));
      return ids;
    },
    onSuccess: (deletedIds) => {
      qc.invalidateQueries({ queryKey: CATEGORIES_KEY });
      toast.success(`${deletedIds.length} categories deleted!`);
    },
    onError: (e) => onError(e, 'delete categories'),
  });
}

export function useUploadCategoryImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      if (!file.type.startsWith('image/')) throw new Error('Please select a valid image file');
      if (file.size > 10 * 1024 * 1024) throw new Error('Image size must be less than 10MB');
      const res = await uploadFile<UploadImageResponse>('/api/v1/upload/category', file);
      if (!res.success) throw new Error(res.message || 'Failed to upload image');
      return res.data.url;
    },
    onError: (e) => onError(e, 'upload image'),
  });
}
