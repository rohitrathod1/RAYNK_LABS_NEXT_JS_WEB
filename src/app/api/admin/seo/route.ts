import { NextResponse } from "next/server";
import { requirePermission } from "@/middleware/permission";
import { getAllSeo } from "@/modules/seo/data/queries";

export async function GET() {
  try {
    await requirePermission("MANAGE_SEO");
    const rows = await getAllSeo();
    const data = rows.map((r) => ({
      id: r.id,
      page: r.page,
      title: r.title,
      description: r.description,
      robots: r.robots,
      updatedAt: r.updatedAt.toISOString(),
    }));
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
