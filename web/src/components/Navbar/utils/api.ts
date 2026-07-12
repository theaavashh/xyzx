import type { NavItem, NavItemsResponse } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export async function fetchNavItems(): Promise<NavItem[]> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/public/navigation/active`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) return [];

    const json: NavItemsResponse = await response.json();

    if (!json.success || !json.data || json.data.length === 0) return [];

    return json.data;
  } catch {
    return [];
  }
}
