import { NextResponse } from 'next/server';
import { getAllSeo } from '@/modules/seo/data/queries';

export const runtime = 'nodejs';

// GET /api/admin/seo — list every SEO entry (admin overview page)
export async function GET() {
  try {
    const data = await getAllSeo();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[GET /api/admin/seo]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch SEO list' },
      { status: 500 },
    );
  }
}
