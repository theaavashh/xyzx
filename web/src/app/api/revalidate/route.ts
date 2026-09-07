import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.REVALIDATE_SECRET;
    const body = await request.json().catch(() => ({}));

    if (!secret || body?.secret !== secret) {
      return NextResponse.json(
        { success: false, message: 'Invalid revalidation secret' },
        { status: 401 },
      );
    }

    const tag: string | undefined = body?.tag;
    if (tag) {
      revalidateTag(tag, 'max');
    }

    // Re-render the homepage so all sections (hero, category grid, etc.)
    // reflect the latest data regardless of tag naming.
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      revalidated: true,
      tag: tag ?? null,
      now: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Revalidation failed' },
      { status: 500 },
    );
  }
}
