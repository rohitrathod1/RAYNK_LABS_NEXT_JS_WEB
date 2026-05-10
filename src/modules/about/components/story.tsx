"use client";

import Image from "next/image";
import { ABOUT_IMAGE_SIZES } from "../constants";
import type { StorySection as StorySectionData } from "../types";
import { resolveAboutImageSrc } from "./shared/image-url";
import { Reveal } from "./shared/reveal";
import { AboutSectionHeading } from "./shared/section-heading";

export function StorySection({ data }: { data: StorySectionData }) {
  const paragraphs = data.content.split("\n").filter((p) => p.trim() !== "");

  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative min-h-[380px] overflow-hidden rounded-2xl border border-border bg-muted shadow-xl lg:min-h-[560px]">
            <Image
              src={resolveAboutImageSrc(data.image)}
              alt="Our story"
              fill
              sizes={ABOUT_IMAGE_SIZES.half}
              className="object-cover transition duration-700 hover:scale-105"
            />
          </Reveal>
          <Reveal className="space-y-8 self-center">
            <AboutSectionHeading title="Our Story" eyebrow="How we got here" align="left" />
            <div className="space-y-4 text-muted-foreground leading-7">
              {paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <ol className="relative space-y-5 border-l border-border pl-6">
              {paragraphs.slice(0, 3).map((paragraph, index) => (
                <li key={`milestone-${index}`} className="relative">
                  <span className="absolute -left-[31px] top-1 flex h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                    Phase {index + 1}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {paragraph}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
