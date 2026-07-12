"use client";

import { memo } from 'react';
import { useDualCardSections } from './hooks';
import { DualCardGrid } from './components';
import { DualCardSkeleton } from './skeleton/DualCardSkeleton';

export default memo(function DualCardSection() {
  const { data, isLoading } = useDualCardSections();
  const section = data?.[0];

  if (isLoading) return <DualCardSkeleton />;
  if (!section || !section.isActive || !section.cards?.length) return null;

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DualCardGrid cards={section.cards} />
      </div>
    </section>
  );
});
