export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9999";

export const GENDER_SLUGS = ["women", "men", "kids", "unisex"];

export function isGenderSlug(value: string): boolean {
  return GENDER_SLUGS.includes(value.toLowerCase());
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function titleCase(value: string): string {
  return value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Cumulative breadcrumb links for a `/products/...` path. */
export function buildCrumbs(segments: string[]): { label: string; href: string }[] {
  const rest = segments[0] === "all" ? segments.slice(1) : segments;
  let href = "/products";
  return rest.map((segment) => {
    href += `/${segment}`;
    return { label: titleCase(segment), href };
  });
}

/**
 * `/products/<gender>/<category>/<slug>` — the gender segment is optional and
 * the last non-gender segment is the category.
 */
export function parseProductsPath(path: string[]): {
  genderSlug: string | null;
  categorySlug: string | null;
} {
  const genderSlug = path.find(isGenderSlug) ?? null;
  const categorySegments = path.filter(
    (segment) => segment !== "all" && !isGenderSlug(segment),
  );
  return {
    genderSlug,
    categorySlug: categorySegments[categorySegments.length - 1] ?? null,
  };
}

export function listingTitle(
  genderSlug: string | null,
  categorySlug: string | null,
): string {
  if (categorySlug) return titleCase(categorySlug);
  if (genderSlug) return capitalize(genderSlug);
  return "All Products";
}

export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  return `${API_BASE_URL}${url}`;
}

const HTML_ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&lt;": "<",
  "&gt;": ">",
};

/** Flattens rich-text product copy into a meta-description sized string. */
export function plainText(html: string | null | undefined, maxLength = 160): string {
  if (!html) return "";
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, (entity) => HTML_ENTITIES[entity.toLowerCase()] ?? " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trimEnd()}…` : text;
}

export interface Variant {
  color?: string;
  size?: string;
  price?: number;
  sku?: string;
}

export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  parentId?: string | null;
  isActive?: boolean;
  children?: CategoryNode[];
}

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  discountPercent: number | null;
  images: string[] | null;
  thumbnail: string | null;
  isNew: boolean;
  isActive: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  isBestSeller: boolean;
  gender: string | null;
  selectedSizes: string[] | null;
  selectedColors: string[] | null;
  variants?: Variant[] | null;
  category?: { id: string; name: string; slug: string } | null;
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: number;
  originalPrice: number | null;
  discountPercent: number | null;
  quantity: number;
  images: string[] | null;
  thumbnail: string | null;
  videos: string[] | null;
  isActive: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  isFeatured: boolean;
  gender: string | null;
  material: string | null;
  season: string | null;
  variantAttributes: string[] | null;
  selectedSizes: string[] | null;
  selectedColors: string[] | null;
  variants: Variant[] | null;
  category: { id: string; name: string; slug: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  pagination?: { page: number; limit: number; total: number; pages: number };
}

export interface ApiItemResponse<T> {
  success: boolean;
  data: T;
}
