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

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {data.points.map((point, index) => (
              <Reveal key={`${point.title}-${index}`} delay={index * 0.035}>
                <article className="group flex h-full min-w-0 gap-4 rounded-[1.75rem] border border-white/10 bg-card/90 p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_70px_-38px_rgba(59,130,246,0.3)] sm:p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition group-hover:bg-primary/20">
                    <AboutIcon name={point.icon} className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="mb-2 text-lg font-semibold leading-tight text-foreground">{point.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground sm:text-[15px]">{point.description}</p>
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
