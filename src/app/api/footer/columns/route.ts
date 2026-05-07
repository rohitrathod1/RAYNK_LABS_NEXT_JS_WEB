import { NextResponse } from 'next/server';
import { requirePermission } from '@/middleware/permission';
import { createColumn } from '@/modules/footer';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    await requirePermission('MANAGE_FOOTER');
    const body = await req.json();
    const result = await createColumn(body);
    if (!result.success) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('[POST /api/footer/columns]', error);
    const status = (error as { status?: number }).status;
    if (status === 401 || status === 403) {
      const msg = error instanceof Error ? error.message : 'Forbidden';
      return NextResponse.json({ success: false, error: msg }, { status });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create column' },
      { status: 500 },
    );
  }
}
