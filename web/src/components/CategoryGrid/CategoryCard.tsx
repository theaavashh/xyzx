'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Category } from './types';

interface CategoryCardProps {
  category: Category;
  priority?: boolean;
}

function CategoryCardComponent({ category, priority }: CategoryCardProps) {
  return (
    <Link
      href={category.link}
      className="group relative block w-full h-full overflow-hidden bg-neutral-100 cursor-pointer"
      aria-label={category.alt || category.title}
    >
      <div className="absolute -inset-2 overflow-hidden">
        <Image
          src={category.image}
          alt={category.alt || category.title}
          fill
          className="object-cover transition-all duration-700 ease-out scale-100 group-hover:scale-110"
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={85}
        />
      </div>

      <div className="absolute inset-0 bg-black/25 transition-colors duration-700 group-hover:bg-black/40" />

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="absolute bottom-3 left-0 right-0 text-left px-4 transition-transform duration-500 ease-out group-hover:-translate-y-1">
        <h3 className="swansea text-base md:text-lg lg:text-xl text-white leading-tight">
          {category.title}
        </h3>
        {category.subtitle && (
          <p className="mt-2 text-sm text-white/80 tracking-wide">
            {category.subtitle}
          </p>
        )}
      </div>
    </Link>
  );
}

export const CategoryCard = memo(CategoryCardComponent);
