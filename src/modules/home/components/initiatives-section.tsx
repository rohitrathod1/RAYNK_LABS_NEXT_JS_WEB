"use client";

import type { InitiativesSection } from "../types";
import { HomeIcon } from "./shared/icon";
import { Reveal } from "./shared/reveal";
import { HomeSectionHeading } from "./shared/section-heading";

export function InitiativesSection({ data }: { data: InitiativesSection }) {
  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <div className="space-y-12">
          <Reveal>
            <HomeSectionHeading title={data.title} subtitle={data.subtitle} />
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.cards.map((card, index) => (
              <Reveal key={`${card.title}-${index}`} delay={index * 0.04}>
                <article className="group h-full rounded-xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <HomeIcon name={card.icon} className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{card.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
