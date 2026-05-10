"use client";

import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import type { WhyDigitalSection } from "../types";
import { HOME_IMAGE_SIZES } from "../constants";
import { resolveHomeImageSrc } from "./shared/image-url";
import { Reveal } from "./shared/reveal";
import { HomeSectionHeading } from "./shared/section-heading";

export function WhyDigitalSection({ data }: { data: WhyDigitalSection }) {
  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal className="relative min-h-[320px] overflow-hidden rounded-2xl border border-border bg-muted shadow-lg lg:h-full">
            <Image
              src={resolveHomeImageSrc(data.image)}
              alt={data.title}
              fill
              sizes={HOME_IMAGE_SIZES.half}
              className="object-cover transition duration-700 hover:scale-105"
            />
          </Reveal>

          <Reveal className="space-y-6">
            <HomeSectionHeading title={data.title} subtitle={data.subtitle} align="left" />

            <ul className="space-y-4">
              {data.bulletPoints.map((point, index) => (
                <li
                  key={`${point}-${index}`}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
