import { getServicesPageData } from "@/modules/services/data/queries";
import { ServicesPageClient } from "@/modules/services/components/main";
import { Metadata } from "next";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Our Services — RaYnk Labs",
  description: "Explore our comprehensive digital services including web design, SEO optimization, and graphic design.",
};

export default async function ServicesPage() {
  const data = await getServicesPageData();

  // Get SEO data
  const seo = await db.seo.findUnique({ where: { page: "services" } });
  if (seo) {
    if (seo.title) metadata.title = seo.title;
    if (seo.description) metadata.description = seo.description;
  }

  return <ServicesPageClient data={data} />;
}
