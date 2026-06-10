'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/utils/api';

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
  category?: string;
}

export interface SitemapData {
  urls: SitemapUrl[];
  totalUrls: number;
  lastModified: string;
  categories: string[];
}

export function useSitemap() {
  return useQuery({
    queryKey: ['sitemap'],
    queryFn: async () => {
      const res = await apiRequest<{ success: boolean; data: SitemapData }>('/api/v1/seo/sitemap');
      return res.data;
    },
  });
}

export function useUpdateSitemap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (urls: SitemapUrl[]) => {
      const res = await apiRequest<{ success: boolean; data: SitemapData }>('/api/v1/seo/sitemap', 'PUT', { urls });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemap'] });
    },
  });
}

export function useAddSitemapUrl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (url: SitemapUrl) =>
      apiRequest('/api/v1/seo/sitemap/urls', 'POST', url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemap'] });
    },
  });
}

export function useDeleteSitemapUrl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (loc: string) =>
      apiRequest(`/api/v1/seo/sitemap/urls?loc=${encodeURIComponent(loc)}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemap'] });
    },
  });
}

export function useGenerateSitemap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await apiRequest<{ success: boolean; data: SitemapData }>('/api/v1/seo/sitemap/generate', 'POST');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemap'] });
    },
  });
}
