'use client';

import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { FeaturedSection as FeaturedSectionType } from '../types';

interface FeaturedSectionCardProps {
  section: FeaturedSectionType;
  index: number;
}

export const FeaturedSectionCard = memo(function FeaturedSectionCard({
  section,
  index,
}: FeaturedSectionCardProps) {
  return (
    <article
      className="overflow-hidden rounded-sm aspect-square block relative group"
      itemScope
      itemType="https://schema.org/ListItem"
      itemProp="itemListElement"
    >
      <meta itemProp="position" content={String(index + 1)} />
      <Link
        href={section.ctaUrl ?? '#'}
        className="block w-full h-full"
        itemProp="url"
        aria-label={section.title ?? 'Featured section'}
      >
        <div className="w-full h-full overflow-hidden">
          <meta itemProp="name" content={section.title ?? ''} />
          <meta itemProp="description" content={section.description ?? ''} />

          {section.image ? (
            <Image
              src={section.image}
              alt={section.title ?? 'Featured section'}
              fill
              priority={index < 3}
              unoptimized
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              itemProp="image"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center">
            <div className="text-center text-white p-6">
              {section.title && (
                <h3
                  className={`lastik text-3xl md:text-4xl mb-3 tracking-wide`}
                  itemProp="name"
                >
                  {section.title}
                </h3>
              )}
              {section.ctaText && (
                <span className="inline-block px-6 py-2.5 rounded-sm bg-[#D4AF37] text-black text-sm font-bold tracking-wider uppercase hover:bg-[#c9a32e] transition-colors duration-300">
                  {section.ctaText}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
});
