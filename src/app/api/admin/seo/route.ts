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
      isIndexed: r.isIndexed,
      updatedAt: r.updatedAt.toISOString(),
    }));
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requirePermission("MANAGE_SEO");
    const body = await req.json();
    const page = typeof body?.page === "string" ? body.page : "";

    if (!page) {
      return NextResponse.json(
        { success: false, error: "Page is required" },
        { status: 400 },
      );
    }

    const { deleteSeo } = await import("@/modules/seo/data/mutations");
    await deleteSeo(page);
    return NextResponse.json({ success: true, message: "Page SEO deleted" });
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
