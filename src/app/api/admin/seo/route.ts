import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/middleware/permission";
import { upsertSeo } from "@/modules/seo/data/mutations";
import { getAllSeo } from "@/modules/seo/data/queries";
import { seoFormSchema } from "@/modules/seo/validations";

export async function GET(req: NextRequest) {
  try {
    await requirePermission("MANAGE_SEO");
    const page = req.nextUrl.searchParams.get("page");
    if (page) {
      const rows = await getAllSeo();
      const data = rows.find((row) => row.page === page) ?? null;
      return NextResponse.json({ success: true, data });
    }

    const rows = await getAllSeo();
    const data = rows.map((r) => ({
      id: r.id,
      page: r.page,
      metaTitle: r.metaTitle,
      metaDescription: r.metaDescription,
      keywords: r.keywords,
      ogImage: r.ogImage,
      canonicalUrl: r.canonicalUrl,
      updatedAt: r.updatedAt.toISOString(),
    }));
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requirePermission("MANAGE_SEO");
    const body = await req.json();
    const parsed = seoFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const seo = await upsertSeo(parsed.data);
    return NextResponse.json({ success: true, data: seo });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
