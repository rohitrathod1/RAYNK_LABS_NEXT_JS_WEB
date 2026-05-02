import dynamic from "next/dynamic";
import type { ServicesPageData } from "../types";

const ServiceHero = dynamic(() => import("./hero").then((mod) => mod.ServiceHero));
const Categories = dynamic(() => import("./categories").then((mod) => mod.Categories));
const WhyChoose = dynamic(() => import("./why").then((mod) => mod.WhyChoose));
const Process = dynamic(() => import("./process").then((mod) => mod.Process));
const ContactCta = dynamic(() => import("./cta").then((mod) => mod.ContactCta));

export function ServicesPageClient({ data }: { data: ServicesPageData }) {
  return (
    <>
      <ServiceHero {...data.hero} />
      <Categories
        categories={data.categories}
        services={data.services_list.services}
      />
      <WhyChoose {...data.why_choose_service} />
      <Process {...data.process} />
      <ContactCta {...data.contact_cta} />
    </>
  );
}
