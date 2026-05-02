import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const post = await db.blogPost.findUnique({
      where: { slug, isPublished: true },
    });

    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}
