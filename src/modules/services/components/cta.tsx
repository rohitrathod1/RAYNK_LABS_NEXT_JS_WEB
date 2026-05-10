import { Button } from "@/components/ui/button";
import type { ContactCtaSection } from "../types";

export function ContactCta({ heading, subheading, ctaText, ctaHref }: ContactCtaSection) {
  return (
    <section id="section5-services-contact-cta" className="scroll-mt-24 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="p-12 bg-primary text-primary-foreground rounded-lg">
          <h2 className="text-3xl font-bold mb-3">{heading}</h2>
          {subheading && <p className="text-lg mb-8 opacity-90">{subheading}</p>}
          <Button size="lg" variant="secondary" asChild>
            <a href={ctaHref}>{ctaText}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
