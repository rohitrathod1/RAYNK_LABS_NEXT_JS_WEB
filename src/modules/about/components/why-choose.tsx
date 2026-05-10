"use client";

import type { WhyChooseSection as WhyChooseSectionData } from "../types";
import { AboutIcon } from "./shared/icon";
import { Reveal } from "./shared/reveal";
import { AboutSectionHeading } from "./shared/section-heading";

export function WhyChooseSection({ data }: { data: WhyChooseSectionData }) {
  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <div className="space-y-12">
          <Reveal>
            <AboutSectionHeading title={data.title} subtitle={data.subtitle} />
          </Reveal>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {data.points.map((point, index) => (
              <Reveal key={`${point.title}-${index}`} delay={index * 0.035}>
                <article className="group flex h-full gap-4 rounded-2xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 transition group-hover:bg-primary/20">
                    <AboutIcon name={point.icon} className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">{point.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {point.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

