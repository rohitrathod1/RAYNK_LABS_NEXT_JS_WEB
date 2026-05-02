import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePermission } from "@/middleware/permission";

export async function GET() {
  try {
    await requirePermission("MANAGE_NAVBAR");

    const links = await db.navLink.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    const parents = links.filter((l) => !l.parentId);
    const children = links.filter((l) => l.parentId);

    const navData = parents.map((parent) => ({
      ...parent,
      children: children
        .filter((c) => c.parentId === parent.id)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }));

    return NextResponse.json({ links: navData });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requirePermission("MANAGE_NAVBAR");
    const body = await req.json();

    const link = await db.navLink.create({
      data: {
        title: body.title,
        href: body.href,
        parentId: body.parentId || null,
        isVisible: body.isVisible ?? true,
        sortOrder: body.sortOrder ?? 0,
      },
    });

    return NextResponse.json({ link });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
