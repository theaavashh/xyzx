import { cache } from "react";
import {
  API_BASE_URL,
  capitalize,
  isGenderSlug,
  parseProductsPath,
  type ApiItemResponse,
  type ApiListResponse,
  type CategoryNode,
  type ProductDetail,
  type ProductSummary,
} from "./shared";

/** Matches the listing's default sort so the server render and client refetches agree. */
const LIST_LIMIT = 50;

/**
 * Returns `null` only when the API says the resource does not exist (404).
 * Anything else (unreachable, 5xx, bad payload) throws so the route renders an
 * error instead of a 404, which would tell crawlers to drop real pages.
 */
async function apiGet<T>(url: string): Promise<T | null> {
  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store" });
  } catch (cause) {
    throw new Error(`Could not reach the API for ${url}`, { cause });
  }

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`API responded with ${res.status} for ${url}`);
  }

  try {
    return (await res.json()) as T;
  } catch (cause) {
    throw new Error(`API returned invalid JSON for ${url}`, { cause });
  }
}

export const fetchProductBySlug = cache(
  async (slug: string): Promise<ProductDetail | null> => {
    const list = await apiGet<ApiListResponse<ProductSummary>>(
      `${API_BASE_URL}/api/v1/products?slug=${encodeURIComponent(slug)}&limit=1&isActive=true`,
    );

    const id =
      list?.success && Array.isArray(list.data) && list.data.length > 0
        ? list.data[0].id
        : null;
    if (!id) return null;

    const item = await apiGet<ApiItemResponse<ProductDetail>>(
      `${API_BASE_URL}/api/v1/products/${id}`,
    );

    return item?.success && item.data ? item.data : null;
  },
);

export const fetchProducts = cache(
  async (filters: {
    genderSlug: string | null;
    categorySlug: string | null;
  }): Promise<ProductSummary[]> => {
    const params = new URLSearchParams({
      sortBy: "createdAt",
      sortOrder: "desc",
      isActive: "true",
      limit: String(LIST_LIMIT),
    });
    if (filters.genderSlug) params.set("gender", capitalize(filters.genderSlug));
    if (filters.categorySlug) params.set("categorySlug", filters.categorySlug);

    const data = await apiGet<ApiListResponse<ProductSummary>>(
      `${API_BASE_URL}/api/v1/products?${params}`,
    );

    return data?.success && Array.isArray(data.data) ? data.data : [];
  },
);

export const fetchCategoryBySlug = cache(
  async (slug: string): Promise<CategoryNode | null> => {
    const data = await apiGet<ApiItemResponse<CategoryNode>>(
      `${API_BASE_URL}/api/v1/categories/slug/${encodeURIComponent(slug)}`,
    );
    return data?.success && data.data ? data.data : null;
  },
);

/** Same-category products for the "You May Like" band, minus the current one. */
export const fetchRelatedProducts = cache(
  async (
    categoryId: string | null,
    excludeId: string,
    limit = 4,
  ): Promise<ProductSummary[]> => {
    const params = new URLSearchParams({
      isActive: "true",
      limit: String(limit * 2),
    });
    if (categoryId) params.set("categoryId", categoryId);

    const data = await apiGet<ApiListResponse<ProductSummary>>(
      `${API_BASE_URL}/api/v1/products?${params}`,
    );
    const products = data?.success && Array.isArray(data.data) ? data.data : [];

    return products.filter((product) => product.id !== excludeId).slice(0, limit);
  },
);

export type ProductsRoute =
  | { kind: "product"; product: ProductDetail; related: ProductSummary[] }
  | {
      kind: "listing";
      genderSlug: string | null;
      categorySlug: string | null;
      products: ProductSummary[];
    };

/**
 * Resolves any `/products/...` path to the page it should render, or `null`
 * when nothing matches (so the page can 404).
 *
 * The last segment wins: it is a product slug if one exists, otherwise a
 * category slug, otherwise the path is not a real page.
 */
export const resolveProductsRoute = cache(
  async (path: string[]): Promise<ProductsRoute | null> => {
    const last = path[path.length - 1];
    if (!last) return null;

    const { genderSlug } = parseProductsPath(path);

    if (path.length === 1) {
      if (isGenderSlug(last)) {
        // `/products/women` lists every product of that gender.
        return {
          kind: "listing",
          genderSlug: last,
          categorySlug: null,
          products: await fetchProducts({ genderSlug: last, categorySlug: null }),
        };
      }
      if (last === "all") {
        return {
          kind: "listing",
          genderSlug: null,
          categorySlug: null,
          products: await fetchProducts({ genderSlug: null, categorySlug: null }),
        };
      }
    }

    const product = await fetchProductBySlug(last);
    if (product) {
      return {
        kind: "product",
        product,
        related: await fetchRelatedProducts(product.category?.id ?? null, product.id),
      };
    }

    const category = await fetchCategoryBySlug(last);
    if (!category || category.isActive === false) return null;

    return {
      kind: "listing",
      genderSlug,
      categorySlug: category.slug,
      products: await fetchProducts({ genderSlug, categorySlug: category.slug }),
    };
  },
);
