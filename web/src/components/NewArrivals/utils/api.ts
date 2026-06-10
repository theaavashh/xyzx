import { getApiBaseUrl } from "@/utils/api";
import type { Product } from "../types";

export async function fetchNewArrivals(): Promise<Product[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const isServer = typeof window === "undefined";

    const response = await fetch(
      `${baseUrl}/api/v1/products?sortBy=createdAt&sortOrder=desc&limit=10&isActive=true`,
      {
        ...(isServer
          ? {
              next: {
                revalidate: 300,
                tags: ["new-arrivals"],
              },
            }
          : {}),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    if (data.success && data.data && Array.isArray(data.data)) {
      return data.data.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category?.name || "Uncategorized",
        price: p.price || 0,
        originalPrice: p.originalPrice || p.price || 0,
        rating: 4.5,
        reviews: Math.floor(Math.random() * 100) + 10,
        image: p.thumbnail || (p.images && p.images[0]) || "",
        isNew: p.isNew || false,
        badge: p.isNew ? "NEW" : p.isOnSale ? "SALE" : "",
      }));
    }

    return [];
  } catch {
    return [];
  }
}

export const PRICE_VALID_UNTIL = new Date(
  Date.now() + 30 * 24 * 60 * 60 * 1000,
).toISOString();
