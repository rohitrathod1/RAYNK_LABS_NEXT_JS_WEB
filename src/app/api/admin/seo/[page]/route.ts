import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSeoByPage } from "@/modules/seo/data/queries";
import { upsertSeo, deleteSeo } from "@/modules/seo/data/mutations";
import { seoFormSchema } from "@/modules/seo/validations";

async function assertAdmin() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
    throw new Error("Unauthorized");
  }
}

type Params = { params: Promise<{ page: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await assertAdmin();
    const { page } = await params;
    const row = await getSeoByPage(decodeURIComponent(page));
    return NextResponse.json({ success: true, data: row });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: msg === "Unauthorized" ? 401 : 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await assertAdmin();
    const { page } = await params;
    const body = await req.json();
    const parsed = seoFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const result = await upsertSeo(decodeURIComponent(page), parsed.data);
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: msg === "Unauthorized" ? 401 : 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await assertAdmin();
    const { page } = await params;
    await deleteSeo(decodeURIComponent(page));
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: msg === "Unauthorized" ? 401 : 400 });
  }
}
