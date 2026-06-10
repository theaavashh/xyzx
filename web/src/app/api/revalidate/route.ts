import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'rapharch-revalidate-secret';

export async function POST(request: NextRequest) {
  const { tag, secret } = await request.json();

  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!tag) {
    return NextResponse.json({ error: 'Tag is required' }, { status: 400 });
  }

  try {
    revalidateTag(tag, 'max');
    return NextResponse.json({ revalidated: true, tag });
  } catch {
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 });
  }
}
