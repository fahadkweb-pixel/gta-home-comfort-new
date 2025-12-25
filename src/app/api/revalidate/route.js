import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

export async function POST(req) {
  try {
    // 1. Validate the "Signature" (Security Check)
    // This ensures the request actually came from Sanity, not a hacker.
    const { isValidSignature, body } = await parseBody(req, process.env.SANITY_REVALIDATE_SECRET);

    if (!isValidSignature) {
      return new NextResponse('Invalid Signature', { status: 401 });
    }

    // 2. Revalidate Everything
    // Since your site is small, we revalidate the whole layout.
    // This ensures Header/Footer changes update everywhere immediately.
    // In Next.js, tagging everything with 'sanity' is a common pattern,
    // but revalidating the root layout is the nuclear option that always works.

    // Note: If you want specific cache tags, we can add them later.
    // For now, this clears the cache for all pages.
    // Ideally, we use revalidatePath('/', 'layout') to refresh everything.

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/', 'layout');

    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
      body,
    });
  } catch (err) {
    console.error(err);
    return new NextResponse(err.message, { status: 500 });
  }
}
