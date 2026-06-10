"use client";

import { useEffect, useState, useCallback, use, useMemo } from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Eye, Search, X, SlidersHorizontal, ChevronDown } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: number;
  originalPrice: number | null;
  discountPercent: number | null;
  images: string[];
  thumbnail: string | null;
  isNew: boolean;
  isActive: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  isBestSeller: boolean;
  gender: string | null;
  selectedSizes: string[] | null;
  selectedColors: string[] | null;
  category?: { id: string; name: string; slug: string };
}

interface ApiResponse {
  success: boolean;
  data: Product[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9999";

const GENDER_OPTIONS = [
  { value: "", label: "All" },
  { value: "Women", label: "Women" },
  { value: "Men", label: "Men" },
  { value: "Kids", label: "Kids" },
  { value: "Unisex", label: "Unisex" },
] as const;

export default function ProductsPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [genderFilter, setGenderFilter] = useState("");
  const [saleOnly, setSaleOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const isGenderPage = ["women", "men", "kids", "unisex"].includes(category.toLowerCase());
  const pageTitle = isGenderPage
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : category === "all"
      ? "All Products"
      : category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const sortParam =
        sortBy === "price-asc"
          ? "sortBy=price&sortOrder=asc"
          : sortBy === "price-desc"
            ? "sortBy=price&sortOrder=desc"
            : "sortBy=createdAt&sortOrder=desc";

      let url = `${API_BASE_URL}/api/v1/products?${sortParam}&limit=50&isActive=true`;

      const effectiveGender = isGenderPage
        ? category.charAt(0).toUpperCase() + category.slice(1)
        : genderFilter;

      if (effectiveGender) {
        url += `&gender=${effectiveGender}`;
      }

      if (saleOnly) {
        url += "&isOnSale=true";
      }

      const response = await fetch(url);
      const data: ApiResponse = await response.json();

      if (data.success && data.data) {
        setProducts(data.data);
      } else {
        setProducts([]);
      }
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [sortBy, category, isGenderPage, genderFilter, saleOnly]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach((p) => p.selectedColors?.forEach((c) => colors.add(c)));
    return Array.from(colors);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q)
      );
    }
    if (selectedColors.length > 0) {
      result = result.filter(
        (p) => p.selectedColors?.some((c) => selectedColors.includes(c))
      );
    }
    return result;
  }, [products, searchQuery, selectedColors]);

  const getBadge = (product: Product): string | null => {
    if (product.isOnSale) return "Sale";
    if (product.isBestSeller) return "Best Seller";
    if (product.isNew) return "New";
    return null;
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const FilterContent = () => (
    <>
      <div className="border-b border-neutral-100 pb-6">
        <h4 className="text-sm font-medium text-neutral-900 mb-4">Gender</h4>
        <div className="space-y-2">
          {GENDER_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="gender"
                checked={genderFilter === opt.value}
                onChange={() => setGenderFilter(opt.value)}
                className="w-4 h-4 accent-black"
              />
              <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-b border-neutral-100 pb-6">
        <h4 className="text-sm font-medium text-neutral-900 mb-4">Sale & Offers</h4>
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={saleOnly}
            onChange={() => setSaleOnly(!saleOnly)}
            className="w-4 h-4 accent-black"
          />
          <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
            On Sale
          </span>
        </label>
      </div>

      {availableColors.length > 0 && (
        <div className="border-b border-neutral-100 pb-6">
          <h4 className="text-sm font-medium text-neutral-900 mb-4">Color</h4>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => (
              <button
                key={color}
                onClick={() => toggleColor(color)}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  selectedColors.includes(color)
                    ? "border-neutral-900 scale-110"
                    : "border-neutral-200 hover:border-neutral-400"
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      <div className="sm:hidden border-b border-neutral-100 pb-6">
        <h4 className="text-sm font-medium text-neutral-900 mb-4">Sort</h4>
        <div className="space-y-2">
          {[
            { value: "newest", label: "Newest" },
            { value: "price-asc", label: "Price: Low to High" },
            { value: "price-desc", label: "Price: High to Low" },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="sortMobile"
                checked={sortBy === opt.value}
                onChange={() => setSortBy(opt.value)}
                className="w-4 h-4 accent-black"
              />
              <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="hidden sm:block pb-6">
        <h4 className="text-sm font-medium text-neutral-900 mb-4">Price</h4>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full border border-neutral-200 rounded px-3 py-2 text-sm text-neutral-600 focus:outline-none focus:border-neutral-400"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Low to High</option>
          <option value="price-desc">High to Low</option>
        </select>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-5 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-6 sm:mb-8 px-4 sm:px-0">
            <div className="flex items-baseline gap-2 mb-1">
              <h1 className="lastik text-3xl sm:text-4xl text-neutral-900 tracking-tight">
                {pageTitle}
              </h1>
              <span className="text-sm text-neutral-400">
                ({isLoading ? "..." : filteredProducts.length})
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6 px-4 sm:px-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFilterOpen(true)}
                className="sm:hidden flex items-center gap-1.5 px-4 py-2 text-sm border border-neutral-200 rounded-full text-neutral-600"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
              </button>
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  {sidebarOpen ? "Hide Filters" : "Show Filters"}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-300" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-40 lg:w-48 pl-9 pr-8 py-2 text-sm border border-neutral-200 rounded-full focus:outline-none focus:border-neutral-400 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-3 h-3 text-neutral-300" />
                  </button>
                )}
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="hidden sm:block border border-neutral-200 rounded-full px-4 py-2 text-sm text-neutral-600 focus:outline-none focus:border-neutral-400 transition-colors"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="flex gap-8">
            {sidebarOpen && (
              <aside className="hidden sm:block w-56 lg:w-64 shrink-0">
                <FilterContent />
              </aside>
            )}

            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 sm:gap-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-neutral-100 rounded-lg aspect-[3/4] mb-3" />
                      <div className="h-3 bg-neutral-100 rounded w-3/4 mb-1.5" />
                      <div className="h-3 bg-neutral-100 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-24">
                  <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto mb-6" />
                  <h2 className="text-lg font-medium text-neutral-900 mb-1">
                    No products found
                  </h2>
                  <p className="text-sm text-neutral-400 mb-8">
                    Try adjusting your filters or search query
                  </p>
                  <Link
                    href="/products/all"
                    className="inline-block rounded-full border border-neutral-200 px-7 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
                  >
                    View all products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 sm:gap-3">
                  {filteredProducts.map((product) => {
                    const productBadge = getBadge(product);
                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}/${product.id}`}
                        className="group"
                      >
                        <div className="relative overflow-hidden bg-neutral-50 rounded-sm mb-2 aspect-[3/4]">
                          {product.images?.[0] ? (
                            <img
                              src={
                                product.images[0].startsWith("http")
                                  ? product.images[0]
                                  : `${API_BASE_URL}${product.images[0]}`
                              }
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : product.thumbnail ? (
                            <img
                              src={
                                product.thumbnail.startsWith("http")
                                  ? product.thumbnail
                                  : `${API_BASE_URL}${product.thumbnail}`
                              }
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-300">
                              <ShoppingBag className="w-10 h-10" />
                            </div>
                          )}

                          {productBadge && (
                            <div className="absolute top-2 left-2">
                              <span
                                className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                                  productBadge === "Best Seller"
                                    ? "bg-black text-white"
                                    : productBadge === "New"
                                      ? "bg-emerald-600 text-white"
                                      : "bg-red-600 text-white"
                                }`}
                              >
                                {productBadge}
                              </span>
                            </div>
                          )}

                          {product.discountPercent && (
                            <div className="absolute top-2 right-2">
                              <span className="bg-red-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                                -{product.discountPercent}%
                              </span>
                            </div>
                          )}

                          <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3">
                            <span className="w-full text-center py-2.5 bg-white/90 backdrop-blur-sm text-xs font-medium text-neutral-900 rounded-full">
                              Quick View
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-xs sm:text-sm text-neutral-700 group-hover:text-neutral-900 transition-colors line-clamp-1">
                            {product.name}
                          </h3>

                          <div className="flex items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-medium text-neutral-900">
                              ${product.price.toFixed(2)}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-[11px] text-neutral-400 line-through">
                                ${product.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>

                          {product.selectedColors && product.selectedColors.length > 0 && (
                            <div className="flex items-center gap-1">
                              {product.selectedColors.slice(0, 4).map((color, i) => (
                                <span
                                  key={i}
                                  className="w-2.5 h-2.5 rounded-full border border-neutral-200"
                                  style={{ backgroundColor: color.toLowerCase() }}
                                  title={color}
                                />
                              ))}
                              {product.selectedColors.length > 4 && (
                                <span className="text-[10px] text-neutral-400 ml-0.5">
                                  +{product.selectedColors.length - 4}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {filterOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 pb-10 animate-slide-up max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-medium text-neutral-900">Filters</h3>
              <button onClick={() => setFilterOpen(false)}>
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>
            <FilterContent />
            <button
              onClick={() => setFilterOpen(false)}
              className="w-full mt-6 py-3 bg-black text-white text-sm font-medium rounded-full"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
