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
  const members = await db.teamMember.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  
  return members.map(m => ({
    ...m,
    bio: m.bio ?? undefined,
    linkedin: m.linkedin ?? undefined,
    twitter: m.twitter ?? undefined,
    github: m.github ?? undefined,
    portfolio: m.portfolio ?? undefined,
  }));
}

export async function getAllTeamMembers() {
  return db.teamMember.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function getTeamMemberById(id: string) {
  return db.teamMember.findUnique({ where: { id } });
}

export async function getTeamSeo() {
  return db.seoMeta.findUnique({ where: { page: "team" } });
}
