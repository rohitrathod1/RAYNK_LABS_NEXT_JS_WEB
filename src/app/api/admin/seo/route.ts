import { NextResponse } from 'next/server';
import { requirePermission } from '@/middleware/permission';
import { getAllSeo } from '@/modules/seo/data/queries';

export const runtime = 'nodejs';

// GET /api/admin/seo — list every SEO entry (admin overview page)
export async function GET() {
  try {
    await requirePermission('MANAGE_SEO');
    const data = await getAllSeo();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[GET /api/admin/seo]', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch SEO list' },
      { status: (error as { status?: number }).status ?? 500 },
    );
  }
}
