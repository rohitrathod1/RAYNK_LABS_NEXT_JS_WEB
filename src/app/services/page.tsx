import type { Metadata } from "next";
import { getServicesPageData } from "@/modules/services/data/queries";
import { ServicesPageClient } from "@/modules/services/components/main";
import { defaultServicesSeo } from "@/modules/services/data/defaults";
import { resolveSeo, getStructuredData } from "@/modules/seo/utils";
import { JsonLd } from "@/components/shared";

export async function generateMetadata(): Promise<Metadata> {
  return resolveSeo("services", defaultServicesSeo);
}

export default async function ServicesPage() {
  const [data, structuredData] = await Promise.all([
    getServicesPageData(),
    getStructuredData("services", defaultServicesSeo),
  ]);
  return (
    <>
      {structuredData && <JsonLd data={structuredData} />}
      <ServicesPageClient data={data} />
    </>
  );
}
