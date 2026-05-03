import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePermission } from "@/middleware/permission";

type ReorderItem = {
  id: string;
  sortOrder: number;
};

export async function POST(req: NextRequest) {
  try {
    await requirePermission("MANAGE_NAVBAR");
    const body = await req.json();
    const items = body?.items;

    if (!Array.isArray(items)) {
      return NextResponse.json({ success: false, error: "Invalid items array" }, { status: 400 });
    }

    await Promise.all(
      (items as ReorderItem[]).map((item) =>
        db.navLink.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to reorder";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
