import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const revalidate = 60;

export async function GET() {
  try {
    const sections = await db.portfolioPage.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    const data: Record<string, unknown> = {};
    for (const s of sections) data[s.section] = s.content;

    const projects = await db.portfolioProject.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ success: true, data: { sections: data, projects } });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}
