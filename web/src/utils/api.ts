/**
 * Get the API base URL from environment variables
 * @throws Error if NEXT_PUBLIC_API_BASE_URL is not set
 */
export function getApiBaseUrl(): string {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';
  if (!apiUrl) {
    throw new Error(
      'NEXT_PUBLIC_API_BASE_URL is not set in environment variables. Please check your .env.local file',
    );
  }
  return apiUrl;
}

/**
 * Make an authenticated API request
 * @param endpoint The API endpoint to call
 * @param options Request options
 * @returns Promise resolving to the response data
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${getApiBaseUrl()}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include cookies for authentication
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `API request failed: ${response.status}`,
    );
  }

  return response.json();
}
