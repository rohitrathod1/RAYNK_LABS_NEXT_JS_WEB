import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePermission } from "@/middleware/permission";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission("MANAGE_NAVBAR");
    const { id } = await params;
    const body = await req.json();

    const link = await db.navLink.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.href !== undefined && { href: body.href }),
        ...(body.parentId !== undefined && { parentId: body.parentId || null }),
        ...(body.isVisible !== undefined && { isVisible: body.isVisible }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      },
    });

    return NextResponse.json({ link });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission("MANAGE_NAVBAR");
    const { id } = await params;

    // Delete children first
    await db.navLink.deleteMany({ where: { parentId: id } });
    await db.navLink.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
