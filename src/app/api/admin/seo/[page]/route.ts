import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/middleware/permission';
import { getSeoByPage } from '@/modules/seo/data/queries';
import {
  updateSeoMetaAction,
  deleteSeoMetaAction,
} from '@/modules/seo/actions';

export const runtime = 'nodejs';

// GET /api/admin/seo/[page] — single SEO row by page key
export async function GET(_req: NextRequest, context: { params: Promise<{ page: string }> }) {
  try {
    await requirePermission('MANAGE_SEO');
    const { page } = await context.params;
    const data = await getSeoByPage(decodeURIComponent(page));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[GET /api/admin/seo/[page]]', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch SEO' },
      { status: (error as { status?: number }).status ?? 500 },
    );
  }
}

// PUT /api/admin/seo/[page] — upsert SEO for a page
export async function PUT(req: NextRequest, context: { params: Promise<{ page: string }> }) {
  try {
    await requirePermission('MANAGE_SEO');
    const { page } = await context.params;
    const body = await req.json();
    const result = await updateSeoMetaAction(decodeURIComponent(page), body);
    if (!result.success) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(result);
  } catch (error) {
    console.error('[PUT /api/admin/seo/[page]]', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to save SEO' },
      { status: (error as { status?: number }).status ?? 500 },
    );
  }
}

// DELETE /api/admin/seo/[page] — remove SEO row (falls back to defaults)
export async function DELETE(_req: NextRequest, context: { params: Promise<{ page: string }> }) {
  try {
    await requirePermission('MANAGE_SEO');
    const { page } = await context.params;
    const result = await deleteSeoMetaAction(decodeURIComponent(page));
    if (!result.success) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(result);
  } catch (error) {
    console.error('[DELETE /api/admin/seo/[page]]', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete SEO' },
      { status: (error as { status?: number }).status ?? 500 },
    );
  }
}
