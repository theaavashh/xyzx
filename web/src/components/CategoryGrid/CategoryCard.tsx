'use client';

import { memo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Category } from './types';

interface CategoryCardProps {
  category: Category;
  priority?: boolean;
}

function CategoryCardComponent({ category, priority }: CategoryCardProps) {
  const handleClick = useCallback(() => {
    // handled by Link
  }, []);

  return (
    <Link
      href={category.link}
      className="group relative block w-full h-full overflow-hidden bg-neutral-100 cursor-pointer"
      aria-label={category.alt || category.title}
    >
      <motion.div
        className="absolute inset-0"
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Image
          src={category.image}
          alt={category.alt || category.title}
          fill
          className="object-cover"
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={85}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 bg-black/25"
        whileHover={{ opacity: 0.45 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />

      <motion.div
        className="absolute bottom-6 md:bottom-8 left-0 right-0 text-center px-6"
        initial={{ y: 8, opacity: 0.9 }}
        whileHover={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <h3 className="lastik text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
          {category.title}
        </h3>
        {category.subtitle && (
          <p className="mt-2 text-sm md:text-base text-white/80 tracking-wide">
            {category.subtitle}
          </p>
        )}
      </motion.div>
    </Link>
  );
}

export const CategoryCard = memo(CategoryCardComponent);
