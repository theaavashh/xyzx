import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';
  const formData = await request.formData();

  const cookieHeader = request.headers.get('cookie') || '';

  const response = await fetch(`${apiBaseUrl}/api/v1/upload/product`, {
    method: 'POST',
    headers: {
      cookie: cookieHeader,
    },
    body: formData,
  });

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
