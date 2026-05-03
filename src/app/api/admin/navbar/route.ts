import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/middleware/permission";
import { createNavLink, getAllNavLinks } from "@/modules/navbar/actions";

export async function GET() {
  try {
    await requirePermission("MANAGE_NAVBAR");
    const data = await getAllNavLinks();
    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ success: false, error: message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requirePermission("MANAGE_NAVBAR");
    const body = await req.json();
    const result = await createNavLink(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
