import { NextResponse } from "next/server";
import { requirePermission } from "@/middleware/permission";
import { updateAdmin, deleteAdmin, getAdminById } from "@/modules/rbac";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requirePermission("MANAGE_USERS");

    const { id } = await params;
    const body = await request.json();
    const { name, email, password, status, imageUrl, bio, mobile } = body;

    const existing = await getAdminById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Admin not found" },
        { status: 404 },
      );
    }

    const updated = await updateAdmin(id, {
      name,
      email,
      password,
      status,
      imageUrl,
      bio,
      mobile,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        status: updated.status,
      },
    });
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requirePermission("MANAGE_USERS");

    const { id } = await params;
    const existing = await getAdminById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Admin not found" },
        { status: 404 },
      );
    }

    if (existing.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Cannot delete super admin" },
        { status: 403 },
      );
    }

    await deleteAdmin(id);

    return NextResponse.json({ success: true, message: "Admin deleted" });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
