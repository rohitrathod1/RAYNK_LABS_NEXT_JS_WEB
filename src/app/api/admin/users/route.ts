import { NextResponse } from "next/server";
import { requirePermission } from "@/middleware/permission";
import { getAdminsWithPermissions } from "@/modules/rbac";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_REGEX = /^[A-Za-z][A-Za-z\s.'-]{1,79}$/;
const PASSWORD_MIN_LENGTH = 8;

export async function GET() {
  try {
    await requirePermission("MANAGE_USERS");
    const admins = await getAdminsWithPermissions();

    const sanitized = admins.filter((admin) => admin.role !== "SUPER_ADMIN").map((admin) => ({
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
    const { name, email, password, imageUrl, bio, mobile, permissions } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    if (!NAME_REGEX.test(String(name).trim())) {
      return NextResponse.json(
        { success: false, error: "Enter a valid name" },
        { status: 400 },
      );
    }

    if (!EMAIL_REGEX.test(String(email).trim())) {
      return NextResponse.json(
        { success: false, error: "Enter a valid email address" },
        { status: 400 },
      );
    }

    if (String(password).length < PASSWORD_MIN_LENGTH) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    if (!Array.isArray(permissions) || permissions.length === 0) {
      return NextResponse.json(
        { success: false, error: "Select at least one permission for this admin" },
        { status: 400 },
      );
    }

    const { createAdmin } = await import("@/modules/rbac");
    const admin = await createAdmin({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      password,
      imageUrl,
      bio,
      mobile,
      permissions: permissions.map((permission) => String(permission)),
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          status: admin.status,
          permissions,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "DUPLICATE_EMAIL") {
      return NextResponse.json(
        { success: false, error: "An admin with this email already exists" },
        { status: 409 },
      );
    }

    if (error instanceof Error && error.message === "DUPLICATE_MOBILE") {
      return NextResponse.json(
        { success: false, error: "An admin with this mobile number already exists" },
        { status: 409 },
      );
    }

    if (error instanceof Error && error.message === "INVALID_PERMISSIONS") {
      return NextResponse.json(
        { success: false, error: "One or more selected permissions are invalid" },
        { status: 400 },
      );
    }

    if ((error as { code?: string }).code === "P2002") {
      return NextResponse.json(
        { success: false, error: "An admin with this email or mobile number already exists" },
        { status: 409 },
      );
    }

    const status = (error as { status?: number }).status ?? 500;
    const message = status === 500 ? "Failed to create admin" : error instanceof Error ? error.message : "Request failed";
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
