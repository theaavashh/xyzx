"use client";

import { memo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchCategories } from "./utils/api";
import type { Category } from "./types";

function CategoryCard({ category, index }: { category: Category; index: number }) {
  return (
    <Link
      href={category.link}
      className="group relative flex-shrink-0 w-[75vw] sm:w-auto snap-start overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden">
        <Image
          src={category.image}
          alt={category.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={index < 4}
          unoptimized
          sizes="(max-width: 640px) 75vw, (max-width: 1024px) 25vw, 20vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white text-lg font-bold tracking-wide drop-shadow-md">{category.title}</h3>
        </div>
      </div>
    </Link>
  );
}

export default memo(function ShopByCategory() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  if (!categories.length) return null;

  return (
    <section className="py-16 bg-[#f9f8f8]">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 lastik uppercase">Shop by Category</h2>
          <p className="text-gray-600 text-lg max-w-2xl">Browse our diverse collection of categories to find exactly what you're looking for</p>
        </div>
        <div
          className="flex sm:grid sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-3 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 scrollbar-hide scroll-smooth snap-x snap-mandatory px-4 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          aria-label="Product categories"
        >
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
});
