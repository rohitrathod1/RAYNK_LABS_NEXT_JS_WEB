import { HeroSectionSkeleton } from "@/modules/contact/components/hero";
import { ContactExperienceSkeleton } from "@/modules/contact/components/contact-experience";

export default function ContactLoading() {
  return (
    <main>
      <HeroSectionSkeleton />
      <ContactExperienceSkeleton />
    </main>
  );
}
