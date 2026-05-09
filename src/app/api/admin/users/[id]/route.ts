import { NextResponse } from "next/server";
import { requirePermission } from "@/middleware/permission";
import { updateAdmin, deleteAdmin, getAdminById } from "@/modules/rbac";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_REGEX = /^[A-Za-z][A-Za-z\s.'-]{1,79}$/;
const PASSWORD_MIN_LENGTH = 8;

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requirePermission("MANAGE_USERS");

    const { id } = await params;
    const body = await request.json();
    const { name, email, password, status, imageUrl, bio, mobile, github, linkedin, instagram, youtube } = body;

    const existing = await getAdminById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Admin not found" },
        { status: 404 },
      );
    }

    if (existing.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Super Admin details are managed from the Profile page" },
        { status: 403 },
      );
    }

    if (name !== undefined && !NAME_REGEX.test(String(name).trim())) {
      return NextResponse.json(
        { success: false, error: "Enter a valid name" },
        { status: 400 },
      );
    }

    if (email !== undefined && !EMAIL_REGEX.test(String(email).trim())) {
      return NextResponse.json(
        { success: false, error: "Enter a valid email address" },
        { status: 400 },
      );
    }

    if (password !== undefined && String(password).length > 0 && String(password).length < PASSWORD_MIN_LENGTH) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const updated = await updateAdmin(id, {
      name: name === undefined ? undefined : String(name).trim(),
      email: email === undefined ? undefined : String(email).trim().toLowerCase(),
      password,
      status,
      imageUrl,
      bio,
      mobile,
      github,
      linkedin,
      instagram,
      youtube,
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
