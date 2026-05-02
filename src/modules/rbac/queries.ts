import { db } from "@/lib/db";

export async function getUserPermissions(userId: string) {
  const userPerms = await db.userPermission.findMany({
    where: { userId },
    include: { permission: { select: { id: true, name: true, description: true } } },
  });
  return userPerms.map((up) => up.permission.name);
}

export async function getAllPermissions() {
  return db.permission.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getAdminsWithPermissions() {
  return db.admin.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
      permissions: {
        include: { permission: { select: { id: true, name: true, description: true } } },
        orderBy: { permission: { name: "asc" } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminById(id: string) {
  return db.admin.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      imageUrl: true,
      bio: true,
      mobile: true,
      createdAt: true,
      updatedAt: true,
      permissions: {
        include: { permission: { select: { id: true, name: true, description: true } } },
        orderBy: { permission: { name: "asc" } },
      },
    },
  });
}
