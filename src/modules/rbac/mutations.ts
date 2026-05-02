import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function createAdmin(data: {
  name: string;
  email: string;
  password: string;
  imageUrl?: string;
  bio?: string;
  mobile?: string;
}) {
  const hashedPassword = await bcrypt.hash(data.password, 12);
  return db.admin.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "ADMIN",
      status: "APPROVED",
      imageUrl: data.imageUrl ?? null,
      bio: data.bio ?? null,
      mobile: data.mobile ?? null,
    },
  });
}

export async function updateAdmin(
  id: string,
  data: {
    name?: string;
    email?: string;
    password?: string;
    status?: string;
    imageUrl?: string;
    bio?: string;
    mobile?: string;
  },
) {
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.password !== undefined && data.password.length > 0) {
    updateData.password = await bcrypt.hash(data.password, 12);
  }
  if (data.status !== undefined) updateData.status = data.status;
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
  if (data.bio !== undefined) updateData.bio = data.bio;
  if (data.mobile !== undefined) updateData.mobile = data.mobile;

  return db.admin.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteAdmin(id: string) {
  return db.admin.delete({ where: { id } });
}

export async function assignPermissions(userId: string, permissionNames: string[]) {
  await db.userPermission.deleteMany({ where: { userId } });

  if (permissionNames.length === 0) return;

  const permissions = await db.permission.findMany({
    where: { name: { in: permissionNames } },
  });

  await db.userPermission.createMany({
    data: permissions.map((p) => ({
      userId,
      permissionId: p.id,
    })),
  });
}
