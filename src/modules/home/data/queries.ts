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
    mission: (data.mission as HomePageData["mission"]) ?? defaultHomeContent.mission,
    "featured-products":
      (data["featured-products"] as HomePageData["featured-products"]) ??
      defaultHomeContent["featured-products"],
    "health-benefits":
      (data["health-benefits"] as HomePageData["health-benefits"]) ??
      defaultHomeContent["health-benefits"],
    testimonials:
      (data.testimonials as HomePageData["testimonials"]) ?? defaultHomeContent.testimonials,
    cta: (data.cta as HomePageData["cta"]) ?? defaultHomeContent.cta,
  };
}

export async function getHomeSection(section: string) {
  return db.homePage.findUnique({ where: { section } });
}

export async function getHomeSeo() {
  return db.seo.findUnique({ where: { page: "home" } });
}
