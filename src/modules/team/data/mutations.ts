import { db } from "@/lib/db";
import type { Admin } from "@prisma/client";

export async function upsertTeamSection(section: string, content: unknown) {
  return db.teamPage.upsert({
    where: { section },
    update: { content: content as never, updatedAt: new Date() },
    create: { section, content: content as never },
  });
}

export async function createTeamMemberFromAdmin(user: Admin) {
  const lastMember = await db.teamMember.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  return db.teamMember.upsert({
    where: { userId: user.id },
    update: {
      displayName: user.name,
      role: user.designation || user.role,
      bio: user.bio,
      avatar: user.imageUrl,
      githubUrl: user.github,
      linkedinUrl: user.linkedin,
      instagramUrl: user.instagram,
      youtubeUrl: user.youtube,
    },
    create: {
      userId: user.id,
      displayName: user.name,
      role: user.designation || user.role,
      bio: user.bio,
      avatar: user.imageUrl,
      githubUrl: user.github,
      linkedinUrl: user.linkedin,
      instagramUrl: user.instagram,
      youtubeUrl: user.youtube,
      sortOrder: (lastMember?.sortOrder ?? -1) + 1,
    },
  });
}

export async function syncTeamMemberFromAdmin(user: Admin) {
  return createTeamMemberFromAdmin(user);
}

