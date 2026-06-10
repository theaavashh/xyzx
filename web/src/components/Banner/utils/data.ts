import type { Banner } from "../types";

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:9999';

export const HEIGHT_CLASSES = {
  sm: "h-32",
  md: "h-48",
  lg: "h-64",
  xl: "h-[320px]",
  full: "h-screen",
} as const;

export async function fetchBanner(): Promise<Banner | null> {
  try {
    const isServer = typeof window === "undefined";

    const response = await fetch(
      `${API_BASE_URL}/api/v1/public/banners/active`,
      {
        ...(isServer
          ? {
              next: {
                revalidate: 300,
                tags: ["banner"],
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
      return null;
    }

    const data = await response.json();

    if (data.success && data.data && data.data.length > 0) {
      return data.data
        .filter((b: Banner) => b.isActive !== false)
        .sort((a: Banner, b: Banner) => (a.order ?? 0) - (b.order ?? 0))[0] ?? null;
    }

    return null;
  } catch {
    return null;
  }
}
