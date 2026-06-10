"use client";

import { useQuery } from '@tanstack/react-query';
import { fetchActiveEditorialSections, fetchProductsByIds, fetchProductsByFeature } from '../utils/api';
import type { EditorialSectionData, Product } from '../types';

const EDITORIAL_QUERY_KEY = ['editorial-section'];

interface EditorialData {
  section: EditorialSectionData | null;
  products: Product[];
}

async function fetchEditorialData(): Promise<EditorialData> {
  const sections = await fetchActiveEditorialSections();
  const section = sections?.[0] || null;
  const productIds = section?.productIds as string[] | undefined;
  let products: Product[] = [];

  if (productIds?.length) {
    products = await fetchProductsByIds(productIds);
  } else if (section?.featureType) {
    products = await fetchProductsByFeature(section.featureType);
  }

  return { section, products };
}

export function useEditorialSection() {
  return useQuery({
    queryKey: EDITORIAL_QUERY_KEY,
    queryFn: fetchEditorialData,
    staleTime: 0,
    refetchInterval: 30_000,
    retry: 1,
  });
}
