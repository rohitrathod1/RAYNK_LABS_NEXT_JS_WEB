import { NextResponse } from "next/server";
import { requirePermission } from "@/middleware/permission";
import { assignPermissions, getAdminById } from "@/modules/rbac";

export async function POST(request: Request) {
  try {
    await requirePermission("MANAGE_USERS");

    const body = await request.json();
    const { userId, permissions } = body;

    if (!userId || !Array.isArray(permissions)) {
      return NextResponse.json(
        { success: false, error: "userId and permissions array are required" },
        { status: 400 },
      );
    }

    const admin = await getAdminById(userId);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Admin not found" },
        { status: 404 },
      );
    }

    await assignPermissions(userId, permissions);

    return NextResponse.json({
      success: true,
      message: "Permissions updated",
      data: { userId, permissions },
    });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
