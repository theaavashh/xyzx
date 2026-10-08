'use client';

import { Fragment, useMemo, useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  API_BASE_URL,
  buildCrumbs,
  capitalize,
  listingTitle,
  parseProductsPath,
  type ApiListResponse,
  type ProductSummary,
} from './shared';
import { effectivePrice } from '@/lib/price';
import {
  ChevronDown,
  ChevronUp,
  Columns2,
  Columns3,
  Eye,
  Filter,
  List,
  SlidersHorizontal,
  Square,
  X,
} from 'lucide-react';

type Product = ProductSummary;

const COLORS = [
  { name: 'Cream', value: '#ead9a9' },
  { name: 'Black', value: '#050505' },
  { name: 'Blue', value: '#1262c9' },
  { name: 'Brown', value: '#9c542e' },
  { name: 'Gray', value: '#858585' },
  { name: 'Green', value: '#0ba63d' },
  { name: 'White', value: '#ffffff' },
  { name: 'Pink', value: '#e8a0bf' },
  { name: 'Red', value: '#c41e3a' },
  { name: 'Yellow', value: '#f5d442' },
];

const GENDER_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'Women', label: 'Women' },
  { value: 'Men', label: 'Men' },
  { value: 'Kids', label: 'Kids' },
  { value: 'Unisex', label: 'Unisex' },
];

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-zinc-100 py-5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-[13px] lg:text-sm font-medium text-zinc-900">{title}</span>
        {open ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
      </button>
      {open && <div className="mt-5">{children}</div>}
    </div>
  );
}

function FilterSidebar({
  sortBy,
  setSortBy,
  genderFilter,
  setGenderFilter,
  saleOnly,
  setSaleOnly,
  selectedColors,
  toggleColor,
  priceRange,
  setPriceRange,
}: {
  sortBy: string;
  setSortBy: (v: string) => void;
  genderFilter: string;
  setGenderFilter: (v: string) => void;
  saleOnly: boolean;
  setSaleOnly: (v: boolean) => void;
  selectedColors: string[];
  toggleColor: (c: string) => void;
  priceRange: [number, number];
  setPriceRange: (v: [number, number]) => void;
}) {
  return (
    <aside className="w-full shrink-0 lg:w-[285px]">
      <FilterSection title="Sort by">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full rounded-md bg-zinc-100 px-3 py-2.5 text-[13px] lg:text-sm text-zinc-700 outline-none"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price, low to high</option>
          <option value="price-desc">Price, high to low</option>
        </select>
      </FilterSection>

      <FilterSection title="Gender">
        <div className="flex flex-wrap gap-2">
          {GENDER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setGenderFilter(opt.value)}
              className={`rounded-full px-4 py-2.5 text-[11px] lg:text-xs transition-colors ${
                genderFilter === opt.value
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price">
        <div>
          <div className="relative h-5">
            <div className="absolute left-1 right-1 top-2 h-[2px] bg-black" />
            <div className="absolute top-0 h-4 w-4 rounded-full bg-black" style={{ left: `${(priceRange[0] / 500) * 100}%` }} />
            <div className="absolute top-0 h-4 w-4 rounded-full bg-black" style={{ left: `${(priceRange[1] / 500) * 100}%` }} />
            <input
              type="range"
              min={0}
              max={500}
              value={priceRange[0]}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val <= priceRange[1]) setPriceRange([val, priceRange[1]]);
              }}
              className="absolute w-full h-5 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
            />
            <input
              type="range"
              min={0}
              max={500}
              value={priceRange[1]}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= priceRange[0]) setPriceRange([priceRange[0], val]);
              }}
              className="absolute w-full h-5 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
            />
          </div>
          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="rounded-md bg-zinc-100 px-3 py-2">
              <div className="text-[10px] lg:text-[11px] text-zinc-500">From</div>
              <div className="text-[13px] lg:text-sm text-zinc-900">${priceRange[0]}</div>
            </div>
            <span className="text-zinc-500">&mdash;</span>
            <div className="rounded-md bg-zinc-100 px-3 py-2">
              <div className="text-[10px] lg:text-[11px] text-zinc-500">To</div>
              <div className="text-[13px] lg:text-sm text-zinc-900">${priceRange[1]}</div>
            </div>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Color">
        <div className="flex flex-wrap gap-3">
          {COLORS.map((color) => (
            <button
              key={color.name}
              type="button"
              title={color.name}
              onClick={() => toggleColor(color.name)}
              className={`h-5 w-5 rounded-full border ring-1 ring-zinc-200 transition-transform hover:scale-110 ${
                selectedColors.includes(color.name) ? 'ring-2 ring-zinc-900' : ''
              }`}
              style={{ backgroundColor: color.value, borderColor: color.value === '#ffffff' ? '#e4e4e7' : color.value }}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Offers">
        <div className="flex items-center justify-between">
          <span className="text-[13px] lg:text-sm text-zinc-700">On Sale</span>
          <button
            type="button"
            role="switch"
            aria-checked={saleOnly}
            onClick={() => setSaleOnly(!saleOnly)}
            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
              saleOnly ? 'bg-zinc-900' : 'bg-zinc-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                saleOnly ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </FilterSection>
    </aside>
  );
}
function buildProductUrl(product: Product): string {
  const gender = product.gender?.toLowerCase() || 'all';
  const categorySlug = product.category?.slug || 'all';
  return `/products/${gender}/${categorySlug}/${product.slug}`;
}

function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const productImage = product.images?.[0] || product.thumbnail || '';
  const productUrl = buildProductUrl(product);
  const price = effectivePrice(product);

  const getBadge = () => {
    if (product.isOnSale) return { text: 'Sale', className: 'bg-red-600 text-white' };
    if (product.isBestSeller) return { text: 'Best Seller', className: 'bg-black text-white' };
    if (product.isNew) return { text: 'New', className: 'bg-emerald-600 text-white' };
    return null;
  };
  const badge = getBadge();

  return (
    <Link
      href={productUrl}
      className="group relative block min-w-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[0.86] overflow-hidden bg-zinc-100">
        {productImage ? (
          <img
            src={productImage.startsWith('http') ? productImage : `${API_BASE_URL}${productImage}`}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-zinc-300 text-xs">No image</div>
        )}

        {badge && (
          <div className="absolute top-2 left-2">
            <span className={`${badge.className} text-[10px] font-semibold px-1.5 py-0.5 rounded`}>{badge.text}</span>
          </div>
        )}

        <button
          type="button"
          onClick={(e) => { e.preventDefault(); }}
          className={`absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white transition-all duration-300 ${
            hovered ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
          }`}
          aria-label="Quick view"
        >
          <Eye className="h-4 w-4 text-zinc-900" strokeWidth={1.6} />
        </button>

        <button
          type="button"
          onClick={(e) => { e.preventDefault(); }}
          className="absolute bottom-0 left-4 right-4 flex h-12 items-center justify-center bg-white text-xs font-medium uppercase tracking-wide text-zinc-900 opacity-0 transition-all duration-300 group-hover:bottom-4 group-hover:opacity-100"
        >
          Add to cart
        </button>
      </div>
      <div className="mt-3">
        <div className="text-sm font-medium text-zinc-900">
          ${price.toFixed(2)}
          {product.originalPrice && product.originalPrice > price && (
            <span className="ml-2 text-xs text-zinc-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <div className="mt-1 text-sm text-zinc-700">{product.name}</div>
        {product.selectedColors && product.selectedColors.length > 0 && (
          <div className="mt-2 flex items-center gap-1">
            {product.selectedColors.slice(0, 4).map((c, i) => (
              <span key={i} className="h-2.5 w-2.5 rounded-full border border-zinc-300" style={{ backgroundColor: c.toLowerCase() }} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

function ProductListRow({ product }: { product: Product }) {
  const productImage = product.images?.[0] || product.thumbnail || '';
  const productUrl = buildProductUrl(product);
  const price = effectivePrice(product);
  return (
    <Link
      href={productUrl}
      className="group flex items-center gap-5 py-5"
    >
      <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-zinc-100 sm:h-32 sm:w-28">
        {productImage ? (
          <img
            src={productImage.startsWith('http') ? productImage : `${API_BASE_URL}${productImage}`}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-300 text-xs">No image</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-zinc-900">{product.name}</div>
        <div className="mt-1 text-sm text-zinc-500">{product.category?.name}</div>
        <div className="mt-2 text-sm font-medium text-zinc-900">
          ${price.toFixed(2)}
          {product.originalPrice && product.originalPrice > price && (
            <span className="ml-2 text-xs text-zinc-400 line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function ProductGrid({
  products,
  viewMode,
}: {
  products: Product[];
  viewMode: 'list' | '1' | '2' | '3';
}) {
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col divide-y divide-zinc-100">
        {products.map((product) => (
          <ProductListRow key={product.id} product={product} />
        ))}
      </div>
    );
  }

  const gridCols =
    viewMode === '1'
      ? 'grid-cols-1'
      : viewMode === '2'
        ? 'grid-cols-2 sm:grid-cols-2'
        : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3';

  return (
    <div className={`grid ${gridCols} gap-[1px] bg-white`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
export default function ProductListingView({
  path,
  initialProducts,
}: {
  path: string[];
  initialProducts: Product[];
}) {
  // `/products/<gender>/<category>/...` — the gender segment is optional and the
  // last non-gender segment is the category.
  const { genderSlug, categorySlug } = parseProductsPath(path);
  const crumbs = buildCrumbs(path);

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [genderFilter, setGenderFilter] = useState('');
  const [saleOnly, setSaleOnly] = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | '1' | '2' | '3'>('3');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  const pageTitle = listingTitle(genderSlug, categorySlug);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const sortParam =
        sortBy === 'price-asc' ? 'sortBy=price&sortOrder=asc'
          : sortBy === 'price-desc' ? 'sortBy=price&sortOrder=desc'
            : 'sortBy=createdAt&sortOrder=desc';
      let url = `${API_BASE_URL}/api/v1/products?${sortParam}&limit=50&isActive=true`;
      const effectiveGender = genderSlug ? capitalize(genderSlug) : genderFilter;
      if (effectiveGender) url += `&gender=${encodeURIComponent(effectiveGender)}`;
      if (categorySlug) url += `&categorySlug=${encodeURIComponent(categorySlug)}`;
      if (saleOnly) url += '&isOnSale=true';
      const response = await fetch(url);
      const data: ApiListResponse<Product> = await response.json();
      setProducts(data.success && data.data ? data.data : []);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [sortBy, genderSlug, categorySlug, genderFilter, saleOnly]);

  // The first render is already server-rendered with the default filters, so only
  // refetch once the user changes a filter or sort order.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedColors.length > 0) {
      result = result.filter((p) => p.selectedColors?.some((c) => selectedColors.includes(c)));
    }
    if (priceRange[0] > 0 || priceRange[1] < 500) {
      result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    }
    return result;
  }, [products, selectedColors, priceRange]);

  const toggleColor = (color: string) => {
    setSelectedColors((prev) => prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]);
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <header className="bg-[#f6f6f6] px-5 py-5 sm:px-8 sm:py-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
          <Link href="/" className="hover:text-zinc-900">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-zinc-900">Collections</Link>
          {crumbs.map((crumb) => (
            <Fragment key={crumb.href}>
              <span>/</span>
              <Link href={crumb.href} className="hover:text-zinc-900">
                {crumb.label}
              </Link>
            </Fragment>
          ))}
        </nav>
        <h1 className="mt-5 bound-regular text-[30px] leading-none tracking-[-0.03em] sm:text-[34px]">{pageTitle}</h1>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-y-4 border-b border-zinc-100 px-5 py-5 sm:px-8">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setMobileFilters(true)}
            className="flex items-center gap-2 text-[13px] font-medium lg:hidden"
          >
            <Filter className="h-4 w-4" strokeWidth={1.5} />
            Filters
          </button>
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="hidden items-center gap-2 text-sm font-medium lg:flex"
          >
            {showFilters ? <X className="h-4 w-4" strokeWidth={1.5} /> : <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />}
            {showFilters ? 'Hide Filters' : 'Filters'}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm">Sort by</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-transparent pr-6 text-sm font-medium outline-none"
              >
                <option value="newest">Featured</option>
                <option value="price-asc">Price, low to high</option>
                <option value="price-desc">Price, high to low</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-1">
            {([['list', List], ['1', Square], ['2', Columns2], ['3', Columns3]] as const).map(
              ([mode, Icon]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  aria-label={mode === 'list' ? 'List view' : `${mode} column grid`}
                  className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                    viewMode === mode ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:bg-zinc-100'
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </button>
              ),
            )}
          </div>
          <span className="text-zinc-900">{filteredProducts.length} products</span>
        </div>
      </div>

      <div className="flex items-start gap-10">
        <div
          className={`hidden overflow-hidden transition-all duration-300 ease-in-out lg:block lg:shrink-0 ${
            showFilters ? 'w-[305px] opacity-100' : 'w-0 opacity-0'
          }`}
        >
          <div className="w-[305px] px-5 sm:px-8">
          <FilterSidebar
            sortBy={sortBy}
            setSortBy={setSortBy}
            genderFilter={genderFilter}
            setGenderFilter={setGenderFilter}
            saleOnly={saleOnly}
            setSaleOnly={setSaleOnly}
            selectedColors={selectedColors}
            toggleColor={toggleColor}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
          </div>
        </div>

        {mobileFilters && (
          <div className="fixed inset-0 z-50 bg-white lg:hidden">
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-5">
              <h2 className="text-[13px] font-medium">Filters</h2>
              <button type="button" onClick={() => setMobileFilters(false)} className="flex items-center gap-1 text-[13px]">
                Close
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="h-[calc(100vh-70px)] overflow-y-auto px-5">
              <FilterSidebar
                sortBy={sortBy}
                setSortBy={setSortBy}
                genderFilter={genderFilter}
                setGenderFilter={setGenderFilter}
                saleOnly={saleOnly}
                setSaleOnly={setSaleOnly}
                selectedColors={selectedColors}
                toggleColor={toggleColor}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-100 bg-white p-5">
              <button
                onClick={() => setMobileFilters(false)}
                className="w-full py-3 bg-zinc-900 text-white text-xs font-medium uppercase tracking-[0.2em] hover:bg-black transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        <div className="min-w-0 flex-1">
          {isLoading ? (
            viewMode === 'list' ? (
              <div className="flex flex-col divide-y divide-zinc-100">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex animate-pulse items-center gap-5 py-5">
                    <div className="h-28 w-24 shrink-0 bg-zinc-100 sm:h-32 sm:w-28" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/3 rounded bg-zinc-100" />
                      <div className="h-3 w-1/4 rounded bg-zinc-100" />
                      <div className="h-3 w-16 rounded bg-zinc-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`grid gap-[1px] bg-white ${
                viewMode === '1'
                  ? 'grid-cols-1'
                  : viewMode === '2'
                    ? 'grid-cols-2 sm:grid-cols-2'
                    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3'
              }`}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-zinc-100 aspect-[0.86]" />
                  </div>
                ))}
              </div>
            )
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-sm text-zinc-400 mb-4">No products found</p>
              <Link href="/products/all" className="text-[12px] font-medium text-zinc-900 underline">View all products</Link>
            </div>
          ) : (
            <ProductGrid products={filteredProducts} viewMode={viewMode} />
          )}
        </div>
      </div>
    </main>
  );
}