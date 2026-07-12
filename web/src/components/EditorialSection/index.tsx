"use client";

import { memo } from 'react';
import { EditorialSectionClient } from './EditorialSectionClient';
import { useEditorialSection } from './hooks';
import { EditorialSkeleton } from './skeleton/EditorialSkeleton';

export default memo(function EditorialSection() {
  const { data, isLoading } = useEditorialSection();
  const { section, products } = data ?? { section: null, products: [] };

  if (isLoading) return <EditorialSkeleton />;
  if (!section) return null;

  return (
    <EditorialSectionClient
      season={section.season}
      title={section.title}
      description={section.description}
      ctaText={section.ctaText}
      ctaLink={section.ctaLink}
      products={products.slice(0, 4)}
    />
  );
});
