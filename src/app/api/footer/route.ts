import { NextResponse } from 'next/server';
import { getVisibleFooter, getAllColumns } from '@/modules/footer';
import { requirePermission } from '@/middleware/permission';

export const runtime = 'nodejs';

// GET /api/footer — Public: visible columns + visible links + setting.
// Admin (?all=true): every column + every link, including hidden.
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const showAll = url.searchParams.get('all') === 'true';

    if (showAll) {
      await requirePermission('MANAGE_FOOTER');
      const columns = await getAllColumns();
      return NextResponse.json({ success: true, data: { columns } });
    }

    const data = await getVisibleFooter();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[GET /api/footer]', error);
    const status = (error as { status?: number }).status;
    if (status === 401 || status === 403) {
      const msg = error instanceof Error ? error.message : 'Forbidden';
      return NextResponse.json({ success: false, error: msg }, { status });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to fetch footer' },
      { status: 500 },
    );
  }
}
