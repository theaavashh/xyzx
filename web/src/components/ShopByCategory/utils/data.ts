import type { Category } from "../types";

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:9999';

export async function fetchCategories(): Promise<Category[]> {
  try {
    const isServer = typeof window === "undefined";

    const response = await fetch(
      `${API_BASE_URL}/api/v1/public/categories?isActive=true`,
      {
        ...(isServer
          ? {
              next: {
                revalidate: 300,
                tags: ["categories"],
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

    if (data.success && data.data && data.data.length > 0) {
      return data.data
        .filter((cat: Category) => cat.isActive !== false)
        .sort((a: Category, b: Category) => (a.order ?? 0) - (b.order ?? 0));
    }

    return [];
  } catch {
    return [];
  }
}
