"use client";

import { memo } from 'react';
import { EditorialSectionClient } from './EditorialSectionClient';
import { useEditorialSection } from './hooks';

export default memo(function EditorialSection() {
  const { data } = useEditorialSection();
  const section = data?.section;
  const products = data?.products || [];

  return (
    <EditorialSectionClient
      season={section?.season || 'Editor\'s Pick'}
      title={section?.title || 'Summer 2025'}
      description={section?.description || 'Handpicked styles for the modern wardrobe'}
      ctaText={section?.ctaText || 'Shop the Edit'}
      ctaLink={section?.ctaLink || '/products'}
      products={products}
    />
  );
});
