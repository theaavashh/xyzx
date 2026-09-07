import { type NextRequest, NextResponse } from 'next/server';
import { serverAuthHeaders } from '@/utils/authHeaders';
import { getServerApiBase } from '@/utils/serverApiBase';

export async function POST(request: NextRequest) {
  try {
    const apiBaseUrl = getServerApiBase();
    const formData = await request.formData();

    const cookieHeader = request.headers.get('cookie') || '';

    const authHeaders = serverAuthHeaders(cookieHeader);
    const { 'content-type': _ct, ...headers } = authHeaders as Record<string, string>;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 300_000);

    let response: Response;
    try {
      response = await fetch(`${apiBaseUrl}/api/v1/upload/file`, {
        method: 'POST',
        headers,
        body: formData,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    const message =
      error?.name === 'AbortError'
        ? 'Upload timed out. Please try again.'
        : error?.message || 'Upload failed';
    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}
