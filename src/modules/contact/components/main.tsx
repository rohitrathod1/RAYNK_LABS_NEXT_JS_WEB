import dynamic from "next/dynamic";
import type { ContactPageData } from "../types";

const HeroSection = dynamic(() => import("./hero").then((mod) => mod.HeroSection));
const InfoSection = dynamic(() => import("./info").then((mod) => mod.InfoSection));
const ContactFormSection = dynamic(() => import("./form").then((mod) => mod.ContactFormSection));
const MapSection = dynamic(() => import("./map").then((mod) => mod.MapSection));
const FaqSection = dynamic(() => import("./faq").then((mod) => mod.FaqSection));
const CtaSection = dynamic(() => import("./cta").then((mod) => mod.CtaSection));

export function ContactPageContent({ data }: { data: ContactPageData }) {
  return (
    <>
      <HeroSection {...data.hero} />
      <InfoSection {...data.contact_info} />
      <ContactFormSection {...data.contact_form} />
      <MapSection {...data.map} />
      <FaqSection {...data.faq} />
      <CtaSection {...data.contact_cta} />
    </>
  );
}
