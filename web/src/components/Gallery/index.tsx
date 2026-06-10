"use client";

import { memo } from "react";
import { GalleryGrid } from "./components";
import type { GalleryItem } from "./types";

const TEST_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    image: "/c1.avif",
    title: "Men",
    description: "Discover men's collection",
    link: "/shop/men",
    linkText: "Shop Men",
    isActive: true,
    order: 1,
  },
  {
    id: 2,
    image: "/c2.avif",
    title: "Women",
    description: "Explore women's collection",
    link: "/shop/women",
    linkText: "Shop Women",
    isActive: true,
    order: 2,
  },
  {
    id: 3,
    image: "/c3.avif",
    title: "Accessories",
    description: "Complete your look",
    link: "/shop/accessories",
    linkText: "Shop Accessories",
    isActive: true,
    order: 3,
  },
];

export default memo(function Gallery() {
  return (
    <section
      aria-labelledby="gallery-heading"
      className="py-12 bg-white"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <meta itemProp="name" content="Gallery" />
      <meta itemProp="description" content="Browse our collections" />

      <div className="max-w-full">
        <GalleryGrid items={TEST_GALLERY_ITEMS} />
      </div>
    </section>
  );
});
