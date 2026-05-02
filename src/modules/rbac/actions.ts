"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/middleware/permission";
import { ok, fail } from "@/lib/action-response";
import { getErrorMessage } from "@/lib/errors";
import { getAllPermissions, getAdminsWithPermissions, getUserPermissions, assignPermissions } from "@/modules/rbac";

export async function getPermissionsAction() {
  try {
    await requirePermission("MANAGE_USERS");
    const permissions = await getAllPermissions();
    return ok(permissions);
  } catch (err) {
    const status = (err as { status?: number }).status;
    if (status === 401 || status === 403) {
      return fail(getErrorMessage(err));
    }
    return fail(getErrorMessage(err));
  }
}

export async function getAdminsAction() {
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
      permissions: admin.permissions.map((up) => up.permission.name),
    }));
    return ok(sanitized);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function getUserPermissionsAction(userId: string) {
  try {
    await requirePermission("MANAGE_USERS");
    const permissions = await getUserPermissions(userId);
    return ok(permissions);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function assignPermissionsAction(userId: string, permissionNames: string[]) {
  try {
    await requirePermission("MANAGE_USERS");

    if (!userId || !Array.isArray(permissionNames)) {
      return fail("userId and permissions array are required");
    }

    await assignPermissions(userId, permissionNames);
    revalidatePath("/admin/users");
    return ok(null, "Permissions updated");
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}
