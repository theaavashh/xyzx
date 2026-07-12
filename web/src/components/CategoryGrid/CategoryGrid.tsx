'use client';

import { memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CategoryCard } from './CategoryCard';
import { fetchCategoryGridItems } from './utils/api';

const CATEGORY_GRID_QUERY_KEY = ['home', 'category-grid'];

function CategoryGridComponent() {
  const { data: categories } = useQuery({
    queryKey: CATEGORY_GRID_QUERY_KEY,
    queryFn: fetchCategoryGridItems,
    staleTime: 5 * 60 * 1000,
  });

  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[3px] md:gap-[4px]">
        {categories.map((category, index) => (
          <div
            key={`${category.title}-${index}`}
            className="relative w-full h-[380px] md:h-[490px] lg:h-[560px] overflow-hidden"
          >
            <CategoryCard
              category={category}
              priority={index < 2}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export const CategoryGrid = memo(CategoryGridComponent);
