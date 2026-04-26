import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllSeo } from "@/modules/seo/data/queries";

async function assertAdmin() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
    throw new Error("Unauthorized");
  }
}

export async function GET() {
  try {
    await assertAdmin();
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
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: msg === "Unauthorized" ? 401 : 500 });
  }
}
