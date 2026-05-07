import { Metadata } from "next";
import { getContactPageData } from "@/modules/contact";
import { ContactPageContent } from "@/modules/contact";
import { defaultSeo } from "@/modules/contact/data/defaults";
import { resolveSeo, getStructuredData } from "@/modules/seo/utils";
import { JsonLd } from "@/components/shared";

export async function generateMetadata(): Promise<Metadata> {
  return resolveSeo("contact", defaultSeo);
}

export default async function ContactPage() {
  const [data, structuredData] = await Promise.all([
    getContactPageData(),
    getStructuredData("contact", defaultSeo),
  ]);

  return (
    <>
      {structuredData && <JsonLd data={structuredData} />}
      <ContactPageContent data={data} />
    </>
  );
}
