import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const revalidate = 60;

export async function GET() {
  try {
    const posts = await db.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json({ success: true, data: posts });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}
