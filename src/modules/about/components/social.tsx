"use client";

import type { SocialLinksSection as SocialLinksSectionData } from "../types";
import { AboutIcon } from "./shared/icon";
import { Reveal } from "./shared/reveal";
import { AboutSectionHeading } from "./shared/section-heading";

export function SocialLinksSection({ data }: { data: SocialLinksSectionData }) {
  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <div className="space-y-10">
          <Reveal>
            <AboutSectionHeading title={data.title} subtitle={data.subtitle} />
          </Reveal>

          <div className="flex flex-wrap justify-center gap-6">
            {data.links.map((link, index) => (
              <Reveal key={`${link.platform}-${index}`} delay={index * 0.05}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-border bg-muted px-6 py-4 transition-all hover:-translate-y-1 hover:bg-muted/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={`Follow RaYnk Labs on ${link.platform}`}
                >
                  <AboutIcon name={link.icon} className="h-6 w-6 text-primary" />
                  <span className="font-medium">{link.platform}</span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

