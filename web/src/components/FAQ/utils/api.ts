import type { FAQItem, FAQResponse } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export async function fetchFAQs(): Promise<FAQItem[]> {
  try {
    const response = await fetch('/api/v1/faqs');

    if (!response.ok) return [];

    const json = await response.json();

    if (Array.isArray(json.data)) {
      return json.data.filter((faq: FAQItem) => faq.isActive).sort((a: FAQItem, b: FAQItem) => a.order - b.order);
    }

    return [];
  } catch {
    return [];
  }
}

export async function fetchAllFAQs(): Promise<FAQItem[]> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/admin/faqs`, {
      credentials: 'include',
    });

    if (!response.ok) return [];

    const json: FAQResponse = await response.json();

    if (json.success && json.data) {
      return json.data.sort((a, b) => a.order - b.order);
    }

    return [];
  } catch {
    return [];
  }
}

export async function createFAQ(faq: Omit<FAQItem, 'id'>): Promise<FAQItem | null> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/admin/faqs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(faq),
    });

    const json = await response.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function updateFAQ(id: string, faq: Partial<FAQItem>): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/admin/faqs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(faq),
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function deleteFAQ(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/admin/faqs/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    return response.ok;
  } catch {
    return false;
  }
}
