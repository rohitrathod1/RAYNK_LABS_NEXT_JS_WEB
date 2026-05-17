"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SplitWords } from "@/components/shared";
import { blurReveal, heroItem, heroStagger } from "@/lib/animation-variants";
import { resolveImageSrc } from "@/lib/image-url";
import { CONTACT_SECTIONS } from "../constants";
import type { HeroSection as HeroSectionProps } from "../types";

export function HeroSection({ title, subtitle, backgroundImage }: HeroSectionProps) {
  const imageSrc = useMemo(() => resolveImageSrc(backgroundImage), [backgroundImage]);
  const [pointer, setPointer] = useState({ x: 52, y: 38 });

  return (
    <section
      id={CONTACT_SECTIONS.hero}
      className="relative isolate flex min-h-[72vh] scroll-mt-24 overflow-hidden bg-[#06070b] sm:min-h-[78vh] lg:min-h-[88vh] 2xl:min-h-[92vh]"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        setPointer({ x, y });
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_32%),linear-gradient(180deg,rgba(7,10,18,0.88),rgba(6,7,11,0.96))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:88px_88px] opacity-[0.12]" />
      <motion.div aria-hidden="true" className="absolute -left-24 top-16 h-60 w-60 rounded-full bg-blue-500/18 blur-3xl" animate={{ x: [0, 30, 0], y: [0, -16, 0], opacity: [0.45, 0.8, 0.45] }} transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }} />
      <motion.div aria-hidden="true" className="absolute right-[-8%] top-[22%] h-72 w-72 rounded-full bg-cyan-400/12 blur-3xl" animate={{ x: [0, -28, 0], y: [0, 22, 0], opacity: [0.35, 0.65, 0.35] }} transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }} />
      <div aria-hidden="true" className="absolute inset-0 opacity-80" style={{ background: `radial-gradient(420px circle at ${pointer.x}% ${pointer.y}%, rgba(59,130,246,0.18), transparent 42%)` }} />

      <motion.div
        aria-hidden="true"
        className="absolute right-[-10%] top-1/2 hidden h-[540px] w-[540px] -translate-y-1/2 lg:block"
        animate={{ x: [0, 12, 0], y: [0, -10, 0], opacity: [0.16, 0.28, 0.16] }}
        transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        style={{ transform: `translate3d(${(pointer.x - 50) * -0.8}px, ${(pointer.y - 50) * -0.5}px, 0)` }}
      >
        <Image src={imageSrc} alt="" fill priority sizes="540px" className="object-contain opacity-70 mix-blend-screen" />
      </motion.div>

      <div className="section-container relative z-10 flex w-full items-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 2xl:max-w-screen-2xl 2xl:px-20 2xl:py-32">
        <motion.div variants={heroStagger} initial="hidden" animate="visible" className="max-w-3xl">
          <motion.div variants={heroItem} className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-xl sm:text-sm">
            <MessageSquareText className="h-4 w-4 text-primary" aria-hidden="true" />
            Tell us what you want to build
          </motion.div>

          <motion.div variants={blurReveal} className="mt-6 max-w-2xl text-balance text-4xl font-black leading-[0.95] text-white sm:mt-8 sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl">
            <SplitWords text={title} inheritParent />
          </motion.div>

          <motion.p variants={heroItem} className="mt-6 max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8 lg:text-xl 2xl:max-w-3xl 2xl:text-2xl">
            {subtitle}
          </motion.p>

          <motion.div variants={heroItem} className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap 2xl:mt-10">
            <Button asChild size="lg" className="group h-12 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_18px_50px_rgba(59,130,246,0.34)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_22px_60px_rgba(59,130,246,0.44)] sm:h-14 sm:px-7 sm:text-base">
              <Link href={`#${CONTACT_SECTIONS.form}`}>
                Start Conversation
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="group h-12 rounded-full border-white/14 bg-white/6 px-6 text-sm text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-white/10 hover:text-white sm:h-14 sm:px-7 sm:text-base">
              <Link href={`#${CONTACT_SECTIONS.cta}`}>
                Schedule a Call
                <CalendarDays className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-background via-background/85 to-transparent" />
    </section>
  );
}

export function HeroSectionSkeleton() {
  return (
    <section className="relative flex min-h-[72vh] animate-pulse items-center overflow-hidden bg-[#06070b] sm:min-h-[78vh] lg:min-h-[88vh] 2xl:min-h-[92vh]">
      <div className="section-container relative z-10 flex w-full items-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 2xl:max-w-screen-2xl 2xl:px-20 2xl:py-32">
        <div className="max-w-3xl">
          <div className="h-10 w-64 rounded-full bg-white/10 sm:w-80" />
          <div className="mt-6 h-16 w-full max-w-2xl rounded-2xl bg-white/12 sm:h-20 lg:h-24 2xl:h-28" />
          <div className="mt-3 h-16 w-5/6 max-w-xl rounded-2xl bg-white/8 sm:h-20 lg:h-24 2xl:h-28" />
          <div className="mt-6 space-y-3 max-w-2xl">
            <div className="h-4 w-full rounded-full bg-white/10 sm:h-5 2xl:h-6" />
            <div className="h-4 w-5/6 rounded-full bg-white/10 sm:h-5 2xl:h-6" />
          </div>
          <div className="mt-8 flex gap-4">
            <div className="h-12 w-44 rounded-full bg-white/10 sm:h-14 sm:w-48" />
            <div className="h-12 w-36 rounded-full bg-white/10 sm:h-14 sm:w-40" />
          </div>
        </div>
      </div>
    </section>
  );
}
