import { memo } from 'react';
import type { Category } from '../types';
import { CategoryCard } from './CategoryCard';

interface CategoryGridProps {
  categories: Category[];
}

export const CategoryGrid = memo(function CategoryGrid({
  categories,
}: CategoryGridProps) {
  return (
    <section
      className="flex sm:grid sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-3 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 scrollbar-hide scroll-smooth snap-x snap-mandatory px-4 sm:px-0"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      aria-label="Product categories"
    >
      {categories.map((category, index) => (
        <CategoryCard
          key={category.id}
          category={category}
          index={index}
          priority={index < 6}
          maxRetries={3}
        />
      ))}
    </section>
  );
});
