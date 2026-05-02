import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const links = await db.navLink.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    });

    const parents = links.filter((l) => !l.parentId);
    const children = links.filter((l) => l.parentId);

    const navData = parents.map((parent) => ({
      title: parent.title,
      href: parent.href,
      subLinks: children
        .filter((c) => c.parentId === parent.id)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((c) => ({
          title: c.title,
          href: c.href,
        })),
    }));

    return NextResponse.json({ links: navData });
  } catch {
    return NextResponse.json({ error: "Failed to fetch navbar" }, { status: 500 });
  }
}
