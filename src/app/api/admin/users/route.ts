import { NextResponse } from "next/server";
import { requirePermission } from "@/middleware/permission";
import { getAdminsWithPermissions } from "@/modules/rbac";

export async function GET() {
  try {
    await requirePermission("MANAGE_USERS");
    const admins = await getAdminsWithPermissions();

    const sanitized = admins.map((admin) => ({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      status: admin.status,
      imageUrl: admin.imageUrl,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      permissions: admin.permissions.map((up) => up.permission),
    }));

    return NextResponse.json({ success: true, data: sanitized });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    await requirePermission("MANAGE_USERS");

    const body = await request.json();
    const { name, email, password, imageUrl, bio, mobile } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    const { createAdmin } = await import("@/modules/rbac");
    const admin = await createAdmin({ name, email, password, imageUrl, bio, mobile });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          status: admin.status,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "P2002") {
      return NextResponse.json(
        { success: false, error: "An admin with this email already exists" },
        { status: 409 },
      );
    }
    const status = (error as { status?: number }).status ?? 500;
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
