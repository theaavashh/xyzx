"use client";

import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedSections } from '../utils/api';

const FEATURED_SECTIONS_QUERY_KEY = ['home', 'featured-sections'];

export function useFeaturedSections() {
  return useQuery({
    queryKey: FEATURED_SECTIONS_QUERY_KEY,
    queryFn: fetchFeaturedSections,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
}
