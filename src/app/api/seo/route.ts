import { NextRequest, NextResponse } from "next/server";
import { getSeoData } from "@/lib/seo";

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page");

  if (!page) {
    return NextResponse.json(
      { success: false, error: "Missing page query parameter" },
      { status: 400 },
    );
  }

  try {
    const data = await getSeoData(page);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch SEO data";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
