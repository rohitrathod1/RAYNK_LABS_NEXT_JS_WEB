import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { success: false, error: "Use /api/navbar and /api/navbar/sublinks ordering controls" },
    { status: 410 },
  );
}
