"use client";

import { useQuery } from '@tanstack/react-query';
import { fetchHeroBanner } from '../utils/api';

const HERO_BANNER_QUERY_KEY = ['home', 'hero-banner'];

export function useHeroBanner() {
  return useQuery({
    queryKey: HERO_BANNER_QUERY_KEY,
    queryFn: fetchHeroBanner,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 30_000,
    retry: 1,
  });
}
