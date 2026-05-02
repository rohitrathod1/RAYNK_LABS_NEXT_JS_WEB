import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/middleware/permission";
import { getSeoByPage } from "@/modules/seo/data/queries";
import { upsertSeo, deleteSeo } from "@/modules/seo/data/mutations";
import { seoFormSchema } from "@/modules/seo/validations";

type Params = { params: Promise<{ page: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await requirePermission("MANAGE_SEO");
    const { page } = await params;
    const row = await getSeoByPage(decodeURIComponent(page));
    return NextResponse.json({ success: true, data: row });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await requirePermission("MANAGE_SEO");
    const { page } = await params;
    const body = await req.json();
    const parsed = seoFormSchema.safeParse({ ...body, page: decodeURIComponent(page) });
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const result = await upsertSeo(parsed.data);
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requirePermission("MANAGE_SEO");
    const { page } = await params;
    await deleteSeo(decodeURIComponent(page));
    return NextResponse.json({ success: true });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
