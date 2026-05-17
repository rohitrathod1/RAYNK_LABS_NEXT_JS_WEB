"use client";

import type { MissionSection as MissionSectionData } from "../types";
import { AboutIcon } from "./shared/icon";
import { Reveal } from "./shared/reveal";
import { AboutSectionHeading } from "./shared/section-heading";

export function MissionSection({ data }: { data: MissionSectionData }) {
  return (
    <section className="section-padding bg-muted/30">
      <span id="vision" className="block scroll-mt-24" aria-hidden="true" />
      <div className="section-container">
        <div className="space-y-12">
          <Reveal>
            <AboutSectionHeading title={data.title} subtitle={data.subtitle} />
          </Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {data.items.map((item, i) => (
              <Reveal key={`${item.title}-${i}`} delay={i * 0.05}>
                <article className="group flex h-full min-w-0 flex-col rounded-[1.75rem] border border-white/10 bg-background/85 p-6 text-left shadow-[0_18px_60px_-40px_rgba(15,23,42,1)] transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_70px_-36px_rgba(59,130,246,0.35)] sm:p-8">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition group-hover:bg-primary/20">
                    <AboutIcon name={item.icon} className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold leading-tight text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{item.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
