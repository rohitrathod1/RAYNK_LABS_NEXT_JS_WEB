import { db } from "@/lib/db";
import type { TeamPageData } from "../types";
import { defaultTeamContent } from "./defaults";

function getDepartment(role: string) {
  const normalized = role.toLowerCase();
  if (normalized.includes("founder") || normalized.includes("ceo") || normalized.includes("admin") || normalized.includes("lead")) return "Leadership";
  if (normalized.includes("design") || normalized.includes("ui") || normalized.includes("ux") || normalized.includes("brand")) return "Design";
  if (normalized.includes("seo") || normalized.includes("marketing") || normalized.includes("growth") || normalized.includes("content")) return "Growth";
  if (normalized.includes("manager") || normalized.includes("operation") || normalized.includes("project")) return "Operations";
  return "Engineering";
}

function getExpertiseTags(role: string, bio?: string | null) {
  const source = `${role} ${bio ?? ""}`.toLowerCase();
  const tags = new Set<string>();
  if (source.includes("full stack") || source.includes("developer") || source.includes("engineer")) tags.add("Full Stack");
  if (source.includes("product")) tags.add("Product");
  if (source.includes("design") || source.includes("ui") || source.includes("ux")) tags.add("Design");
  if (source.includes("seo") || source.includes("growth") || source.includes("marketing")) tags.add("Growth");
  if (source.includes("strategy") || source.includes("founder")) tags.add("Strategy");
  if (source.includes("frontend")) tags.add("Frontend");
  if (source.includes("backend")) tags.add("Backend");
  if (tags.size === 0) tags.add(getDepartment(role));
  return Array.from(tags).slice(0, 4);
}

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
      portfolioUrl?: string | null;
      isFeatured?: boolean;
      isVisible?: boolean;
      sortOrder?: number;
      createdAt?: Date | string;
      user?: { email: string; mobile?: string | null; portfolio?: string | null } | null;
    }>>;
  };

  const members = await teamMemberModel.findMany({
    where: { isVisible: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: { user: { select: { email: true, mobile: true, portfolio: true } } },
  });

  const sorted = members.sort((a, b) => {
    const order = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    if (order !== 0) return order;
    return new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime();
  });

  return sorted.map((m) => ({
    id: m.id,
    displayName: m.displayName ?? m.name ?? "Team Member",
    role: m.role,
    department: getDepartment(m.role),
    bio: m.bio ?? undefined,
    avatar: m.avatar ?? m.image ?? undefined,
    githubUrl: m.githubUrl ?? m.github ?? undefined,
    linkedinUrl: m.linkedinUrl ?? m.linkedin ?? undefined,
    instagramUrl: m.instagramUrl ?? undefined,
    youtubeUrl: m.youtubeUrl ?? undefined,
    portfolioUrl: m.portfolioUrl ?? m.user?.portfolio ?? undefined,
    email: m.user?.email ?? undefined,
    phone: m.user?.mobile ?? undefined,
    expertiseTags: getExpertiseTags(m.role, m.bio),
    isVisible: m.isVisible ?? true,
    isFeatured: m.isFeatured ?? false,
    sortOrder: m.sortOrder ?? 0,
  }));
}

export async function getAllTeamMembers() {
  return db.teamMember.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
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
