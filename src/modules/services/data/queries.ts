import { db } from "@/lib/db";
import type { ServicesPageData } from "../types";
import { defaultServicesContent } from "./defaults";

export async function getServicesPageData(): Promise<ServicesPageData> {
  const sections = await db.servicesPage.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const data: Record<string, unknown> = {};
  for (const s of sections) data[s.section] = s.content;

  return {
    hero: (data.hero as ServicesPageData["hero"]) ?? defaultServicesContent.hero,
    categories: (data.categories as ServicesPageData["categories"]) ?? defaultServicesContent.categories,
    services_list: (data.services_list as ServicesPageData["services_list"]) ?? defaultServicesContent.services_list,
    why_choose_service: (data.why_choose_service as ServicesPageData["why_choose_service"]) ?? defaultServicesContent.why_choose_service,
    process: (data.process as ServicesPageData["process"]) ?? defaultServicesContent.process,
    contact_cta: (data.contact_cta as ServicesPageData["contact_cta"]) ?? defaultServicesContent.contact_cta,
  };
}

export async function getServicesSection(section: string) {
  return db.servicesPage.findUnique({ where: { section } });
}

export async function getServicesSeo() {
  return db.seoPage.findUnique({ where: { page: "services" } });
}
