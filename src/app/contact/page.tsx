import { Metadata } from "next";
import { getContactPageData } from "@/modules/contact";
import { ContactPageContent } from "@/modules/contact";
import { defaultSeo } from "@/modules/contact/data/defaults";
import { resolveSeo, getStructuredData } from "@/modules/seo/utils";
import { JsonLd } from "@/components/shared";
import { SITE_URL } from "@/lib/constants";

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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: data.hero.title,
          description: data.hero.subtitle,
          url: `${SITE_URL}/contact`,
          mainEntity: {
            "@type": "Organization",
            name: "RaYnk Labs",
            url: SITE_URL,
            contactPoint: data.contact_info.items.map((item) => ({
              "@type": "ContactPoint",
              contactType: item.label,
              email: item.icon === "Mail" ? item.value : undefined,
              telephone: item.icon === "Phone" ? item.value : undefined,
              areaServed: "IN",
            })),
          },
        }}
      />
      {data.faq.items.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: data.faq.items.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }}
        />
      )}
      <ContactPageContent data={data} />
    </>
  );
}
