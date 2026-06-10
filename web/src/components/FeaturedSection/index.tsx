"use client";

import { memo } from "react";
import { FeaturedSectionGrid } from './components';
import type { FeaturedSection as FeaturedSectionType } from './types';

const MOCK_SECTIONS: FeaturedSectionType[] = [
  {
    id: '1',
    title: 'New Arrivals',
    subtitle: 'Fresh styles just landed',
    description: 'Check out the latest drops',
    image: '/p2.webp',
    ctaUrl: '/products',
    ctaText: 'Shop Now',
    isActive: true,
    order: 1,
  },
  {
    id: '2',
    title: 'Boots Collection',
    subtitle: 'Step up your style',
    description: 'Premium boots for every occasion',
    image: '/boots-banner.png',
    ctaUrl: '/products',
    ctaText: 'Explore',
    isActive: true,
    order: 2,
  },
  {
    id: '3',
    title: 'Summer Sale',
    subtitle: 'Up to 50% off',
    description: 'Limited time offers',
    image: '/raphard-main-banner.webp',
    ctaUrl: '/products',
    ctaText: 'Shop Sale',
    isActive: true,
    order: 3,
  },
];

export default memo(function FeaturedSection() {
  return (
    <section
      aria-labelledby="featured-heading"
      className="py-12 bg-white"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <meta itemProp="name" content="Featured Sections" />
      <meta itemProp="description" content="Featured promotions and collections" />

      <div className="max-w-full">
        <FeaturedSectionGrid sections={MOCK_SECTIONS} />
      </div>
    </section>
  );
});
