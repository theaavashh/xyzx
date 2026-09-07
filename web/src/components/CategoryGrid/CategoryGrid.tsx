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
    <section className="w-full bg-[#F7F6F3] mt-5 overflow-hidden">
      <div className="flex md:grid md:grid-cols-4 gap-[3px] md:gap-[4px] overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 pr-4 sm:pr-6 lg:pr-8 ml-4 sm:ml-6 lg:ml-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {categories.map((category, index) => (
          <div
            key={`${category.title}-${index}`}
            className="flex-shrink-0 w-[70vw] sm:w-[45vw] md:w-auto aspect-[4/5] md:aspect-auto md:h-[500px] relative overflow-hidden snap-start"
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
