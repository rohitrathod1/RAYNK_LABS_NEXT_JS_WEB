"use client";

import { useMemo, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { SafeImage } from "@/components/shared/safe-image";
import { ABOUT_IMAGE_SIZES } from "../constants";
import type { StorySection as StorySectionData } from "../types";
import { AboutSectionHeading } from "./shared/section-heading";

const imageVariants = {
  hidden: { opacity: 0, x: -36, scale: 0.97 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.7 },
  },
};

const contentVariants = {
  hidden: { opacity: 0, x: 36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.72, delay: 0.05 },
  },
};

export function StorySection({ data }: { data: StorySectionData }) {
  const paragraphs = useMemo(
    () => data.content.split("\n").filter((paragraph) => paragraph.trim() !== ""),
    [data.content],
  );
  const reducedMotion = useReducedMotion();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(contentRef, { once: true, amount: 0.24 });
  const [activePhase, setActivePhase] = useState(0);

  const timeline = paragraphs.slice(0, 3).map((paragraph, index) => ({
    title: `Phase ${index + 1}`,
    excerpt: paragraph,
  }));

  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <motion.div
            initial={reducedMotion ? false : "hidden"}
            whileInView={reducedMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.22 }}
            variants={imageVariants}
            className="relative min-h-[320px] overflow-hidden rounded-[2rem] border border-white/10 bg-muted shadow-[0_24px_90px_-40px_rgba(15,23,42,0.9)] sm:min-h-[420px] lg:min-h-[600px]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(59,130,246,0.16),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.12))]" />
            <SafeImage
              src={data.image || "placeholder.png"}
              alt="RaYnk Labs story"
              fill
              sizes={ABOUT_IMAGE_SIZES.half}
              className="object-cover grayscale transition duration-700 hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-white/5" />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-black/35 px-4 py-4 backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary">Built with intent</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/70">
                Product thinking, design clarity, and engineering execution moving in one direction.
              </p>
            </div>
          </motion.div>

          <motion.div
            ref={contentRef}
            initial={reducedMotion ? false : "hidden"}
            animate={reducedMotion || inView ? "visible" : "hidden"}
            variants={contentVariants}
            className="space-y-8 self-center"
          >
            <AboutSectionHeading title="Our Story" eyebrow="How we got here" align="left" />
            <div className="space-y-4 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
              {paragraphs.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                  animate={reducedMotion || inView ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.55, delay: 0.12 + index * 0.08 }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <div className="relative pl-7 sm:pl-8">
              <div className="absolute left-[10px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-primary/80 via-primary/30 to-transparent" />
              <ol className="space-y-4">
                {timeline.map((phase, index) => {
                  const isActive = activePhase === index;
                  return (
                    <motion.li
                      key={phase.title}
                      initial={reducedMotion ? false : { opacity: 0, x: 16 }}
                      animate={reducedMotion || inView ? { opacity: 1, x: 0 } : undefined}
                      transition={{ duration: 0.45, delay: 0.28 + index * 0.1 }}
                      onMouseEnter={() => setActivePhase(index)}
                      className={`group relative rounded-2xl border px-4 py-4 transition duration-300 sm:px-5 ${
                        isActive
                          ? "border-primary/30 bg-primary/10 shadow-[0_16px_50px_-28px_rgba(59,130,246,0.7)]"
                          : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                      }`}
                    >
                      <span
                        className={`absolute left-[-22px] top-6 flex h-4 w-4 items-center justify-center rounded-full border transition ${
                          isActive
                            ? "border-primary/50 bg-primary shadow-[0_0_0_6px_rgba(59,130,246,0.12)]"
                            : "border-white/20 bg-background"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-white" : "bg-primary/60"}`} />
                      </span>
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">{phase.title}</p>
                      <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground">{phase.excerpt}</p>
                    </motion.li>
                  );
                })}
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
