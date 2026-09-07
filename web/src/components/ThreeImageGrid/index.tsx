'use client';

import { memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ThreeImageGridClient } from './components/ThreeImageGridClient';
import type { ThreeImageGridColumn } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

function mapColumns(apiColumns: any[]): ThreeImageGridColumn[] {
  return apiColumns
    .sort((a: any, b: any) => a.order - b.order)
    .map((col: any) => ({
      image: {
        id: col.id,
        src: col.imageSrc,
        alt: col.imageAlt,
        link: col.imageLink || undefined,
      },
      product: col.productName
        ? {
            id: col.id,
            name: col.productName,
            price: col.productPrice || 0,
            originalPrice: col.productOriginalPrice || undefined,
            image: col.productImage || '',
            link: col.productLink || '#',
          }
        : undefined,
    }));
}

export default memo(function ThreeImageGrid() {
  const { data } = useQuery({
    queryKey: ['three-image-grid-active'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/v1/public/three-image-grid/active`);
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      return json.data || [];
    },
    staleTime: 60_000,
  });

  const section = data?.[0];
  if (!section?.columns?.length) return null;

  const columns = mapColumns(section.columns);

  return (
    <section className="py-8 flex justify-center bg-[#F7F6F3]">
        <div className="max-w-[1400px] w-full px-4 sm:px-6 lg:px-8">
        <ThreeImageGridClient columns={columns} />
      </div>
    </section>
  );
});
