"use client";

import type { ServicesSection } from "../types";
import { HomeIcon } from "./shared/icon";
import { Reveal } from "./shared/reveal";
import { HomeSectionHeading } from "./shared/section-heading";

export function ServicesSection({ data }: { data: ServicesSection }) {
  return (
    <section className="section-padding bg-muted/30">
      <div className="section-container">
        <div className="space-y-12">
          <Reveal>
            <HomeSectionHeading title={data.title} subtitle={data.subtitle} />
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.services.map((service, index) => (
              <Reveal key={`${service.title}-${index}`} delay={index * 0.035}>
                <article className="group h-full rounded-xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <HomeIcon name={service.icon} className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
