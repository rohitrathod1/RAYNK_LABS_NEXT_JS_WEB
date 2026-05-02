import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const sections = await db.teamPage.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    const data: Record<string, unknown> = {};
    for (const s of sections) data[s.section] = s.content;

    const teamMembers = await db.teamMember.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ success: true, data: { sections: data, teamMembers } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
