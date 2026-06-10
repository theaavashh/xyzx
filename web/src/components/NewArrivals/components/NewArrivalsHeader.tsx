'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';

interface NewArrivalsHeaderProps {
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllLabel?: string;
}

export const NewArrivalsHeader = memo(function NewArrivalsHeader({
  title = 'New Arrivals',
  subtitle = 'Discover the latest drops and exclusive releases',
  viewAllLink = '/shop/new-arrivals',
  viewAllLabel = 'View More',
}: NewArrivalsHeaderProps) {
  return (
    <header className="flex flex-row md:items-center md:justify-between mb-8 gap-4 px-4 md:px-16">
      <div>
        <h2 className={`text-xl md:text-4xl text-[#C6E2E7] mb-2 lastik uppercase`}>
          {title}
        </h2>
        <p className="text-sm md:text-xl text-gray-600">{subtitle}</p>
      </div>

      <div className="flex items-center gap-1">
        <Link
          href={viewAllLink}
          className="text-lg text-gray-600 hover:text-black font-medium flex items-center group transition-colors"
          aria-label={`View all ${title.toLowerCase()}`}
        >
          {viewAllLabel}
          <ChevronRight
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            aria-hidden="true"
          />
        </Link>
      </div>
    </header>
  );
});
