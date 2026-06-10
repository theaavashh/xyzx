"use client";

import { memo } from 'react';
import { DualCardGrid } from './components';
import { useDualCardSections } from './hooks';
import { DualCardSkeleton } from './skeleton/DualCardSkeleton';

function DualCardSectionContent() {
  const { data: sections, isFetching } = useDualCardSections();

  const cards = sections
    ?.filter((section) => section.isActive !== false)
    .flatMap((section) => section.cards)
    .slice(0, 2) ?? [];

  if (isFetching || cards.length < 2) {
    return <DualCardSkeleton />;
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DualCardGrid cards={cards} />
      </div>
    </section>
  );
}

export default memo(function DualCardSection() {
  return <DualCardSectionContent />;
});
