import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function createAdmin(data: {
  name: string;
  email: string;
  password: string;
  imageUrl?: string;
  bio?: string;
  mobile?: string;
  permissions?: string[];
}) {
  const email = data.email.trim().toLowerCase();
  const mobile = data.mobile?.trim() || undefined;
  const existing = await db.admin.findFirst({
    where: {
      OR: [
        { email },
        ...(mobile ? [{ mobile }] : []),
      ],
    },
    select: { email: true, mobile: true },
  });

  if (existing?.email === email) {
    throw new Error("DUPLICATE_EMAIL");
  }
  if (mobile && existing?.mobile === mobile) {
    throw new Error("DUPLICATE_MOBILE");
  }

  const permissionNames = [...new Set(data.permissions ?? [])];
  const permissions =
    permissionNames.length > 0
      ? await db.permission.findMany({
          where: { name: { in: permissionNames } },
          select: { id: true, name: true },
        })
      : [];

  const foundNames = new Set(permissions.map((permission) => permission.name));
  const missing = permissionNames.filter((name) => !foundNames.has(name));
  if (missing.length > 0) {
    throw new Error("INVALID_PERMISSIONS");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const admin = await db.admin.create({
    data: {
      name: data.name.trim(),
      email,
      password: hashedPassword,
      role: "ADMIN",
      status: "APPROVED",
      imageUrl: data.imageUrl ?? null,
      bio: data.bio ?? null,
      mobile: mobile ?? null,
    },
  });

  if (permissions.length > 0) {
    await db.userPermission.createMany({
      data: permissions.map((permission) => ({
        userId: admin.id,
        permissionId: permission.id,
      })),
      skipDuplicates: true,
    });
  }

  const { createTeamMemberFromAdmin } = await import("@/modules/team/data/mutations");
  await createTeamMemberFromAdmin(admin);

  return admin;
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
    github?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
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
  if (data.github !== undefined) updateData.github = data.github;
  if (data.linkedin !== undefined) updateData.linkedin = data.linkedin;
  if (data.instagram !== undefined) updateData.instagram = data.instagram;
  if (data.youtube !== undefined) updateData.youtube = data.youtube;

  const admin = await db.admin.update({
    where: { id },
    data: updateData,
  });

  const { syncTeamMemberFromAdmin } = await import("@/modules/team/data/mutations");
  await syncTeamMemberFromAdmin(admin);

  return admin;
}

export async function deleteAdmin(id: string) {
  return db.admin.delete({ where: { id } });
}

export async function assignPermissions(userId: string, permissionNames: string[]) {
  const uniqueNames = [...new Set(permissionNames)];
  const permissions = await db.permission.findMany({
    where: { name: { in: uniqueNames } },
  });

  const foundNames = new Set(permissions.map((permission) => permission.name));
  const missing = uniqueNames.filter((name) => !foundNames.has(name));
  if (missing.length > 0) {
    throw new Error(`Unknown permissions: ${missing.join(", ")}`);
  }

  await db.userPermission.deleteMany({ where: { userId } });

  if (permissions.length === 0) return;

  await db.userPermission.createMany({
    data: permissions.map((permission) => ({
      userId,
      permissionId: permission.id,
    })),
    skipDuplicates: true,
  });
}
