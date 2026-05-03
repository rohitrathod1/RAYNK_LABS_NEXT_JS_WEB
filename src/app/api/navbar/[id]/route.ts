import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';
import {
  getNavLink,
  updateNavLink,
  deleteNavLink,
} from '@/modules/navbar/actions';

export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

// GET /api/navbar/:id — Admin only
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const result = await getNavLink(id);
    if (!result.success) return NextResponse.json(result, { status: 404 });
    return NextResponse.json(result);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    console.error('[GET /api/navbar/:id]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch nav link' },
      { status },
    );
  }
}

// PUT /api/navbar/:id — Admin only
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const result = await updateNavLink(id, body);
    if (!result.success) {
      const status = result.error === 'Nav link not found' ? 404 : 400;
      return NextResponse.json(result, { status });
    }
    return NextResponse.json(result);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    console.error('[PUT /api/navbar/:id]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update nav link' },
      { status },
    );
  }
}

// DELETE /api/navbar/:id — Admin only
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const result = await deleteNavLink(id);
    if (!result.success) return NextResponse.json(result, { status: 404 });
    return NextResponse.json(result);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    console.error('[DELETE /api/navbar/:id]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete nav link' },
      { status },
    );
  }
}
