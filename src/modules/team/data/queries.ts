import { db } from "@/lib/db";
import type { TeamPageData } from "../types";
import { defaultTeamContent } from "./defaults";

export async function getTeamPageData(): Promise<TeamPageData> {
  const sections = await db.teamPage.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const data: Record<string, unknown> = {};
  for (const s of sections) data[s.section] = s.content;

  return {
    hero: (data.hero as TeamPageData["hero"]) ?? defaultTeamContent.hero,
    intro: (data.intro as TeamPageData["intro"]) ?? defaultTeamContent.intro,
    founders: (data.founders as TeamPageData["founders"]) ?? defaultTeamContent.founders,
    team_members: (data.team_members as TeamPageData["team_members"]) ?? defaultTeamContent.team_members,
    values: (data.values as TeamPageData["values"]) ?? defaultTeamContent.values,
    contact_cta: (data.contact_cta as TeamPageData["contact_cta"]) ?? defaultTeamContent.contact_cta,
  };
}

export async function getTeamSection(section: string) {
  return db.teamPage.findUnique({ where: { section } });
}

export async function getTeamMembers() {
  const teamMemberModel = db.teamMember as unknown as {
    findMany: (args: unknown) => Promise<Array<{
      id: string;
      displayName?: string;
      name?: string;
      role: string;
      bio?: string | null;
      avatar?: string | null;
      image?: string | null;
      githubUrl?: string | null;
      github?: string | null;
      linkedinUrl?: string | null;
      linkedin?: string | null;
      instagramUrl?: string | null;
      youtubeUrl?: string | null;
      isFeatured?: boolean;
      createdAt?: Date | string;
      user?: { email: string } | null;
    }>>;
  };

  let members: Awaited<ReturnType<typeof teamMemberModel.findMany>>;
  try {
    members = await teamMemberModel.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: "asc" },
      include: { user: { select: { email: true } } },
    });
  } catch {
    members = await teamMemberModel.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });
  }

  const sorted = members.sort((a, b) => {
    const featured = Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured));
    if (featured !== 0) return featured;
    return new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime();
  });
  
  return sorted.map((m) => ({
    id: m.id,
    displayName: m.displayName ?? m.name ?? "Team Member",
    role: m.role,
    bio: m.bio ?? undefined,
    avatar: m.avatar ?? m.image ?? undefined,
    githubUrl: m.githubUrl ?? m.github ?? undefined,
    linkedinUrl: m.linkedinUrl ?? m.linkedin ?? undefined,
    instagramUrl: m.instagramUrl ?? undefined,
    youtubeUrl: m.youtubeUrl ?? undefined,
    email: m.user?.email ?? undefined,
    isFeatured: m.isFeatured ?? false,
  }));
}

export async function getAllTeamMembers() {
  return db.teamMember.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          role: true,
          status: true,
          imageUrl: true,
          bio: true,
          github: true,
          linkedin: true,
          instagram: true,
          youtube: true,
          createdAt: true,
        },
      },
    },
  });
}

export async function getTeamMemberById(id: string) {
  return db.teamMember.findUnique({ where: { id } });
}

export async function getTeamSeo() {
  return db.seoMeta.findUnique({ where: { page: "team" } });
}
