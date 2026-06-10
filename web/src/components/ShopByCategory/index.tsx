"use client";

import { memo, useEffect, useState } from "react";
import { CategoryGrid, ShopByCategoryHeader } from "./components";
import type { Category } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export default memo(function ShopByCategory() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/public/shop-by-categories/active`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setCategories(data.data);
        }
      })
      .catch(() => {});
  }, []);

  if (!categories.length) return null;

  return (
    <section className="py-16 bg-[#f9f8f8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ShopByCategoryHeader />
        <CategoryGrid categories={categories} />
      </div>
    </section>
  );
});
