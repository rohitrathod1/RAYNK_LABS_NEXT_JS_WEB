import { db } from "@/lib/db";
import type { AboutPageData } from "../types";
import { defaultAboutContent } from "./defaults";

export async function getAboutPageData(): Promise<AboutPageData> {
  const sections = await db.aboutPage.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const data: Record<string, unknown> = {};
  for (const s of sections) data[s.section] = s.content;

  return {
    hero: (data.hero as AboutPageData["hero"]) ?? defaultAboutContent.hero,
    story: (data.story as AboutPageData["story"]) ?? defaultAboutContent.story,
    mission: (data.mission as AboutPageData["mission"]) ?? defaultAboutContent.mission,
    why_choose_us: (data.why_choose_us as AboutPageData["why_choose_us"]) ?? defaultAboutContent.why_choose_us,
    core_team: (data.core_team as AboutPageData["core_team"]) ?? defaultAboutContent.core_team,
    social_links: (data.social_links as AboutPageData["social_links"]) ?? defaultAboutContent.social_links,
  };
}

export async function getAboutSection(section: string) {
  return db.aboutPage.findUnique({ where: { section } });
}

export async function getAboutSeo() {
  return db.seo.findUnique({ where: { page: "about" } });
}
