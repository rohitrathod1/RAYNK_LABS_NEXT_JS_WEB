import { NextResponse } from 'next/server';
import { requirePermission } from '@/middleware/permission';
import { updateLink, deleteLink } from '@/modules/footer';

export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  try {
    await requirePermission('MANAGE_FOOTER');
    const { id } = await params;
    const body = await req.json();
    const result = await updateLink(id, body);
    if (!result.success) {
      const status = result.error === 'Link not found' ? 404 : 400;
      return NextResponse.json(result, { status });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('[PUT /api/footer/links/:id]', error);
    const status = (error as { status?: number }).status;
    if (status === 401 || status === 403) {
      const msg = error instanceof Error ? error.message : 'Forbidden';
      return NextResponse.json({ success: false, error: msg }, { status });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update link' },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await requirePermission('MANAGE_FOOTER');
    const { id } = await params;
    const result = await deleteLink(id);
    if (!result.success) return NextResponse.json(result, { status: 404 });
    return NextResponse.json(result);
  } catch (error) {
    console.error('[DELETE /api/footer/links/:id]', error);
    const status = (error as { status?: number }).status;
    if (status === 401 || status === 403) {
      const msg = error instanceof Error ? error.message : 'Forbidden';
      return NextResponse.json({ success: false, error: msg }, { status });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to delete link' },
      { status: 500 },
    );
  }
}
