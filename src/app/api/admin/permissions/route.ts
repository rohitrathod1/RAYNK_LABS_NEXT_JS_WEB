import { NextResponse } from "next/server";
import { requirePermission } from "@/middleware/permission";
import { getAllPermissions } from "@/modules/rbac";

export async function GET() {
  try {
    await requirePermission("MANAGE_USERS");
    const permissions = await getAllPermissions();
    return NextResponse.json({ success: true, data: permissions });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
