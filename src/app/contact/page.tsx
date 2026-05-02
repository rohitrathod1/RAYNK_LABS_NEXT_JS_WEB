import { Metadata } from "next";
import { getContactPageData, getContactSeo } from "@/modules/contact";
import { ContactPageContent } from "@/modules/contact";
import { resolveSeo } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getContactSeo();
  return resolveSeo(seo);
}

export default async function ContactPage() {
  const [data, seo] = await Promise.all([
    getContactPageData(),
    getContactSeo(),
  ]);

  return (
    <>
      <ContactPageContent data={data} />
    </>
  );
}
