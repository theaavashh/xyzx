"use client";

import { useQuery } from '@tanstack/react-query';
import { fetchDualCardSections } from '../utils/api';

const DUAL_CARD_SECTIONS_QUERY_KEY = ['home', 'dual-card-sections'];

export function useDualCardSections() {
  return useQuery({
    queryKey: DUAL_CARD_SECTIONS_QUERY_KEY,
    queryFn: fetchDualCardSections,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
}
