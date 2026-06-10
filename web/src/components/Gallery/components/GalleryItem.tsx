"use client";

import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import type { GalleryItem as GalleryItemType } from '../types';

interface GalleryItemProps {
  item: GalleryItemType;
  index: number;
  priority?: boolean;
}

export const GalleryItem = memo(function GalleryItem({
  item,
  index,
  priority = false,
}: GalleryItemProps) {
  return (
    <article
      className="overflow-hidden rounded-sm aspect-square block relative group"
      itemScope
      itemType="https://schema.org/ListItem"
      itemProp="itemListElement"
    >
      <meta itemProp="position" content={String(index + 1)} />
      <Link
        href={item.link}
        className="block w-full h-full"
        itemProp="url"
        aria-label={`${item.title} - ${item.description}`}
      >
        <div
          className="w-full h-full overflow-hidden"
          itemScope
          itemType="https://schema.org/CollectionPage"
        >
          <meta itemProp="name" content={item.title} />
          <meta itemProp="description" content={item.description} />

          <Image
            src={item.image}
            alt={item.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            itemProp="image"
            loading={priority ? 'eager' : 'lazy'}
            quality={85}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center">
            <div className="text-center text-white p-6">
              <h3
                className={`lastik text-3xl md:text-4xl mb-4 tracking-wide`}
                itemProp="name"
              >
                {item.title}
              </h3>
              <span
                className="inline-block px-6 py-2.5 rounded-sm bg-[#D4AF37] text-black text-sm font-bold tracking-wider uppercase hover:bg-[#c9a32e] transition-colors duration-300"
                itemProp="potentialAction"
                itemScope
                itemType="https://schema.org/SearchAction"
              >
                <meta
                  itemProp="target"
                  content={`${process.env.NEXT_PUBLIC_SITE_URL}${item.link}`}
                />
                {item.linkText}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
});
