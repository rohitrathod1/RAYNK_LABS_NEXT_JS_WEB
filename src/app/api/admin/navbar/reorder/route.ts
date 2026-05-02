import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePermission } from "@/middleware/permission";

export async function POST(req: NextRequest) {
  try {
    await requirePermission("MANAGE_NAVBAR");
    const body = await req.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items array" }, { status: 400 });
    }

    const updates = items.map((item: { id: string; sortOrder: number; parentId?: string | null }) =>
      db.navLink.update({
        where: { id: item.id },
        data: {
          sortOrder: item.sortOrder,
          ...(item.parentId !== undefined && { parentId: item.parentId || null }),
        },
      })
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to reorder";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
