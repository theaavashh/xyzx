'use client';

import { memo } from 'react';
import type { FeaturedSection as FeaturedSectionType } from '../types';
import { FeaturedSectionCard } from './FeaturedSectionCard';

interface FeaturedSectionGridProps {
  sections: FeaturedSectionType[];
}

export const FeaturedSectionGrid = memo(function FeaturedSectionGrid({
  sections,
}: FeaturedSectionGridProps) {
  if (!sections.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
      {sections.map((section, index) => (
        <FeaturedSectionCard
          key={section.id}
          section={section}
          index={index}
        />
      ))}
    </div>
  );
});
