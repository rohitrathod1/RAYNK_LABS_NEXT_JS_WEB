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
  return db.$transaction(async (tx) => {
    const admin = await tx.admin.create({
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

    const lastMember = await tx.teamMember.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    await tx.teamMember.create({
      data: {
        userId: admin.id,
        displayName: admin.name,
        role: admin.role,
        bio: admin.bio,
        avatar: admin.imageUrl,
        githubUrl: admin.github,
        linkedinUrl: admin.linkedin,
        instagramUrl: admin.instagram,
        youtubeUrl: admin.youtube,
        sortOrder: (lastMember?.sortOrder ?? -1) + 1,
      },
    });

    return admin;
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

  await db.$transaction(async (tx) => {
    await tx.userPermission.deleteMany({ where: { userId } });

    if (permissions.length === 0) return;

    await tx.userPermission.createMany({
      data: permissions.map((permission) => ({
        userId,
        permissionId: permission.id,
      })),
      skipDuplicates: true,
    });
  });
}
