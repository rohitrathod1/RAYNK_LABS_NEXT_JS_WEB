"use client";

import { useCallback, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ABOUT_IMAGE_SIZES } from "../constants";
import type { HeroSection as HeroSectionData } from "../types";
import { resolveAboutImageSrc } from "./shared/image-url";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7 },
  },
};

export function HeroSection({ data }: { data: HeroSectionData }) {
  const reducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 18, mass: 0.4 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 18, mass: 0.4 });
  const parallaxX = useTransform(smoothX, [-1, 1], reducedMotion ? [0, 0] : [-24, 24]);
  const parallaxY = useTransform(smoothY, [-1, 1], reducedMotion ? [0, 0] : [-18, 18]);

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (reducedMotion) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY, reducedMotion],
  );

  return (
    <section
      id="section1-about-hero"
      className="relative min-h-[calc(78svh-4rem)] overflow-hidden bg-background"
      onMouseMove={handleMouseMove}
    >
      <span id="hero" className="block scroll-mt-24" aria-hidden="true" />

      <div className="absolute inset-0">
        <Image
          src={resolveAboutImageSrc(data.backgroundImage)}
          alt=""
          fill
          priority
          sizes={ABOUT_IMAGE_SIZES.hero}
          className="object-cover opacity-[0.14]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(59,130,246,0.22),transparent_34%),radial-gradient(circle_at_78%_18%,rgba(168,85,247,0.12),transparent_28%),linear-gradient(180deg,rgba(6,8,16,0.58),rgba(7,9,17,0.74)_48%,rgba(5,7,14,0.96))]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <motion.div
        aria-hidden="true"
        style={{ x: parallaxX, y: parallaxY }}
        className="pointer-events-none absolute right-[-6%] top-1/2 hidden -translate-y-1/2 select-none lg:block"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" />
          <div className="text-[clamp(7rem,18vw,15rem)] font-black leading-[0.85] tracking-[-0.06em] text-white/[0.06]">
            <div>RAYNK</div>
            <div>LABS</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={reducedMotion ? undefined : { y: [0, -14, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[10%] top-[18%] hidden h-24 w-24 rounded-full border border-white/10 bg-white/[0.04] blur-[1px] md:block"
      />
      <motion.div
        animate={reducedMotion ? undefined : { y: [0, 16, 0], x: [0, 8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[18%] top-[22%] hidden h-16 w-16 rounded-3xl border border-primary/25 bg-primary/10 md:block"
      />
      <motion.div
        animate={reducedMotion ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        className="absolute bottom-[24%] left-[8%] hidden h-20 w-20 rotate-12 rounded-[2rem] border border-white/10 bg-white/[0.03] lg:block"
      />

      <div className="relative z-10 section-container flex min-h-[calc(78svh-4rem)] items-center py-20 sm:py-24 lg:py-28">
        <motion.div
          initial={reducedMotion ? false : "hidden"}
          animate={reducedMotion ? undefined : "visible"}
          variants={containerVariants}
          className="max-w-4xl"
        >
          <motion.div variants={itemVariants} className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            About RaYnk Labs
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="max-w-4xl text-balance text-4xl font-black leading-[0.95] tracking-[-0.05em] text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {data.title}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl text-pretty text-base leading-7 text-white/70 sm:text-lg sm:leading-8 md:text-xl"
          >
            {data.subtitle}
          </motion.p>

          <motion.div variants={itemVariants} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full px-7 shadow-[0_18px_60px_-20px_rgba(59,130,246,0.8)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_24px_70px_-18px_rgba(59,130,246,0.9)]"
            >
              <Link href="#section7-about-collaborate">
                Start a Project
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/12 bg-white/[0.04] px-7 text-foreground backdrop-blur-xl transition duration-300 hover:scale-[1.02] hover:border-primary/30 hover:bg-white/[0.08] hover:shadow-[0_0_40px_-18px_rgba(59,130,246,0.45)]"
            >
              <Link href="#section6-about-team">Meet the Team</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}



