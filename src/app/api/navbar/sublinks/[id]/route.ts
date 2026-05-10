import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';
import { updateNavSubLink, deleteNavSubLink } from '@/modules/navbar';

export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

async function readJsonBody(req: Request) {
  const text = await req.text();
  if (!text.trim()) return {};

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

// PUT /api/navbar/sublinks/:id — Admin only
export async function PUT(req: Request, { params }: Params) {
  await requireAdmin();

  try {
    const { id } = await params;
    const body = await readJsonBody(req);
    if (body === null) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request body' },
        { status: 400 },
      );
    }
    const result = await updateNavSubLink(id, body);
    if (!result.success) {
      const status = result.error === 'Sub-link not found' ? 404 : 400;
      return NextResponse.json(result, { status });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('[PUT /api/navbar/sublinks/:id]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update sub-link' },
      { status: 500 },
    );
  }
}

// DELETE /api/navbar/sublinks/:id — Admin only
export async function DELETE(_req: Request, { params }: Params) {
  await requireAdmin();

  try {
    const { id } = await params;
    const result = await deleteNavSubLink(id);
    if (!result.success) return NextResponse.json(result, { status: 404 });
    return NextResponse.json(result);
  } catch (error) {
    console.error('[DELETE /api/navbar/sublinks/:id]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete sub-link' },
      { status: 500 },
    );
  }
}
