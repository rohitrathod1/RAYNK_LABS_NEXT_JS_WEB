import { db } from "@/lib/db";
import type { HomePageData } from "../types";
import { defaultHomeContent } from "./defaults";

export async function getHomePageData(): Promise<HomePageData> {
  const sections = await db.homePage.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const data: Record<string, unknown> = {};
  for (const s of sections) data[s.section] = s.content;

  return {
    hero: (data.hero as HomePageData["hero"]) ?? defaultHomeContent.hero,
    initiatives: (data.initiatives as HomePageData["initiatives"]) ?? defaultHomeContent.initiatives,
    services: (data.services as HomePageData["services"]) ?? defaultHomeContent.services,
    why_digital: (data.why_digital as HomePageData["why_digital"]) ?? defaultHomeContent.why_digital,
    portfolio_preview: (data.portfolio_preview as HomePageData["portfolio_preview"]) ?? defaultHomeContent.portfolio_preview,
    testimonials: (data.testimonials as HomePageData["testimonials"]) ?? defaultHomeContent.testimonials,
    why_choose_us: (data.why_choose_us as HomePageData["why_choose_us"]) ?? defaultHomeContent.why_choose_us,
    contact_cta: (data.contact_cta as HomePageData["contact_cta"]) ?? defaultHomeContent.contact_cta,
  };
}

export async function getHomeSection(section: string) {
  return db.homePage.findUnique({ where: { section } });
}

export async function getHomeSeo() {
  return db.seoMeta.findUnique({ where: { page: "home" } });
}
