import type { Metadata } from "next";
import { getServicesPageData } from "@/modules/services/data/queries";
import { ServicesPageClient } from "@/modules/services/components/main";
import { getSeoData, resolveSeo } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData("services");
  return resolveSeo(seo, "Our Services - RaYnk Labs");
}

export default async function ServicesPage() {
  const data = await getServicesPageData();
  return <ServicesPageClient data={data} />;
}
