"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { CtaSection } from "../types";
import { Reveal } from "./shared/reveal";

export function CtaSection({ data }: { data: CtaSection }) {
  return (
    <section className="section-padding bg-primary text-primary-foreground" aria-labelledby="home-cta-title">
      <div className="section-container">
        <Reveal className="text-center space-y-8 max-w-3xl mx-auto">
          <h2 id="home-cta-title" className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            {data.heading}
          </h2>
          {data.subheading && (
            <p className="text-lg text-white/80 leading-relaxed">
              {data.subheading}
            </p>
          )}
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="text-base px-8 py-6"
          >
            <Link href={data.ctaHref}>{data.ctaText}</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
