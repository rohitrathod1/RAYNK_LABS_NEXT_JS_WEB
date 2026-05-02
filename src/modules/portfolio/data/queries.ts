import { db } from "@/lib/db";
import type { PortfolioPageData, ProjectItem } from "../types";
import { defaultPortfolioContent } from "./defaults";

export async function getPortfolioPageData(): Promise<PortfolioPageData> {
  const sections = await db.portfolioPage.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const data: Record<string, unknown> = {};
  for (const s of sections) data[s.section] = s.content;

  return {
    hero: (data.hero as PortfolioPageData["hero"]) ?? defaultPortfolioContent.hero,
    categories_filter:
      (data.categories_filter as PortfolioPageData["categories_filter"]) ??
      defaultPortfolioContent.categories_filter,
    projects_grid:
      (data.projects_grid as PortfolioPageData["projects_grid"]) ??
      defaultPortfolioContent.projects_grid,
    testimonials:
      (data.testimonials as PortfolioPageData["testimonials"]) ??
      defaultPortfolioContent.testimonials,
    contact_cta:
      (data.contact_cta as PortfolioPageData["contact_cta"]) ??
      defaultPortfolioContent.contact_cta,
  };
}

export async function getPortfolioProjects(category?: string): Promise<ProjectItem[]> {
  const where: Record<string, unknown> = { isActive: true };
  if (category && category !== "All") {
    where.category = category;
  }

  const projects = await db.portfolioProject.findMany({
    where,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return projects as ProjectItem[];
}

export async function getPortfolioProject(slug: string) {
  return db.portfolioProject.findUnique({
    where: { slug },
  });
}

export async function getAllPortfolioCategories(): Promise<string[]> {
  const categories = await db.portfolioProject.findMany({
    where: { isActive: true },
    select: { category: true },
    distinct: ["category"],
  });

  return categories.map((c) => c.category);
}

export async function getPortfolioSection(section: string) {
  return db.portfolioPage.findUnique({ where: { section } });
}

export async function getPortfolioSeo() {
  return db.seoPage.findUnique({ where: { page: "portfolio" } });
}

export async function getAllPortfolioProjectsAdmin() {
  return db.portfolioProject.findMany({
    orderBy: [{ createdAt: "desc" }],
  });
}
