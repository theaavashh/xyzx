import type { EditorialSectionData, EditorialResponse, Product } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export async function fetchActiveEditorialSections(): Promise<EditorialSectionData[]> {
  try {
    const response = await fetch(
      `${API_BASE}/api/v1/public/editorial-sections/active`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (!response.ok) return [];

    const json: EditorialResponse = await response.json();

    if (!json.success || !json.data) return [];

    return json.data.map((section) => ({
      ...section,
      images: (section.images || []).map((img) => ({
        ...img,
        src: img.src.startsWith('http') ? img.src : img.src,
      })),
    }));
  } catch {
    return [];
  }
}

interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  thumbnail?: string | null;
  images?: string[] | null;
  isNew: boolean;
  isOnSale: boolean;
  isBestSeller: boolean;
  selectedSizes?: string[] | null;
  selectedColors?: string[] | null;
  category?: { id: string; name: string; slug: string } | null;
}

function extractVariantColors(variants?: Array<{ color?: string }>): string[] {
  if (!variants?.length) return [];
  const colors = new Set<string>();
  for (const v of variants) {
    if (v.color) colors.add(v.color);
  }
  return Array.from(colors);
}

function mapApiProduct(p: ApiProduct & { variants?: Array<{ color?: string }> }): Product {
  const colors = Array.isArray(p.selectedColors) && p.selectedColors.length
    ? p.selectedColors
    : extractVariantColors(p.variants);
  const badge = p.isNew ? 'NEW' : p.isOnSale ? 'SALE' : p.isBestSeller ? 'Best Seller' : '';
  return {
    id: p.id,
    name: p.name,
    category: p.category?.name || '',
    price: p.price,
    originalPrice: p.originalPrice ?? p.price,
    rating: 0,
    reviews: 0,
    image: p.thumbnail || (Array.isArray(p.images) && p.images[0]) || '',
    images: Array.isArray(p.images) ? p.images : [],
    isNew: p.isNew || false,
    badge,
    colors,
    sizes: Array.isArray(p.selectedSizes) ? p.selectedSizes : [],
    colorOptions: colors,
  };
}

export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
  if (!ids.length) return [];

  try {
    const results = await Promise.allSettled(
      ids.map((id) =>
        fetch(`${API_BASE}/api/v1/products/${id}`, {
          headers: { 'Content-Type': 'application/json' },
        }).then((r) => (r.ok ? r.json() : Promise.reject())),
      ),
    );

    const products: Product[] = [];
    for (const result of results) {
      if (result.status === 'fulfilled') {
        const json = result.value;
        if (json?.success && json?.data) {
          products.push(mapApiProduct(json.data as ApiProduct));
        }
      }
    }
    return products;
  } catch {
    return [];
  }
}

export async function fetchProductsByFeature(featureType: string): Promise<Product[]> {
  try {
    const params = new URLSearchParams({
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit: '10',
      isActive: 'true',
    });
    params.set(featureType, 'true');

    const response = await fetch(`${API_BASE}/api/v1/products?${params.toString()}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });

    if (!response.ok) return [];

    const data = await response.json();
    if (!data.success || !data.data || !Array.isArray(data.data)) return [];

    return data.data.map((p: Record<string, unknown>): Product => {
      const selectedColors = p.selectedColors as string[] | null;
      const variants = p.variants as Array<{ color?: string }> | undefined;
      const colors = (Array.isArray(selectedColors) && selectedColors.length)
        ? selectedColors
        : extractVariantColors(variants);
      return {
        id: (p.id as string) ?? '',
        name: (p.name as string) ?? '',
        category: ((p.category as Record<string, unknown>)?.name as string) ?? 'Uncategorized',
        price: (p.price as number) ?? 0,
        originalPrice: ((p.originalPrice as number) ?? (p.price as number)) ?? 0,
        rating: 0,
        reviews: 0,
        image: (p.thumbnail as string) || ((p.images as string[])?.[0]) || '',
        images: (p.images as string[]) ?? [],
        isNew: (p.isNew as boolean) ?? false,
        badge: (p.isNew as boolean) ? 'NEW' : (p.isOnSale as boolean) ? 'SALE' : '',
        colors,
        colorOptions: colors,
      };
    });
  } catch {
    return [];
  }
}
