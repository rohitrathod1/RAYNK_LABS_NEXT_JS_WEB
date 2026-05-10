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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.items.map((item, i) => (
              <Reveal key={`${item.title}-${i}`} delay={i * 0.05}>
              <article className="group h-full rounded-2xl border border-border bg-background p-8 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition group-hover:bg-primary/20">
                  <AboutIcon name={item.icon} className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </article>
              </Reveal>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
