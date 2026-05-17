"use client";

import { type MouseEvent, useCallback } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resolveImageSrc } from "@/lib/image-url";
import { heroItem, heroStagger } from "@/lib/animation-variants";
import { SERVICES_IMAGE_SIZES } from "../constants";
import type { ServiceHero } from "../types";

export function ServiceHero({ title, subtitle, backgroundImage }: ServiceHero) {
  const imageSrc = resolveImageSrc(backgroundImage);
  const reducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 18, mass: 0.4 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 18, mass: 0.4 });
  const glowX = useTransform(smoothX, [-1, 1], ["35%", "65%"]);
  const glowY = useTransform(smoothY, [-1, 1], ["38%", "62%"]);
  const parallaxX = useTransform(smoothX, [-1, 1], reducedMotion ? [0, 0] : [-22, 22]);
  const parallaxY = useTransform(smoothY, [-1, 1], reducedMotion ? [0, 0] : [-18, 18]);

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (reducedMotion) return;
      const rect = event.currentTarget.getBoundingClientRect();
      mouseX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
      mouseY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
    },
    [mouseX, mouseY, reducedMotion],
  );

  return (
    <section
      id="section1-services-hero"
      className="relative min-h-[64svh] scroll-mt-24 overflow-hidden bg-background"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0">
        <Image src={imageSrc} alt="" fill priority sizes={SERVICES_IMAGE_SIZES.hero} className="object-cover opacity-[0.12]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,18,0.76),rgba(7,10,18,0.86)_48%,rgba(5,7,14,0.98)),radial-gradient(circle_at_20%_22%,rgba(59,130,246,0.18),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(168,85,247,0.12),transparent_26%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:76px_76px]" />
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 blur-3xl"
          animate={reducedMotion ? undefined : { opacity: [0.4, 0.68, 0.45] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(59,130,246,0.24), transparent 16%), radial-gradient(circle at 78% 28%, rgba(168,85,247,0.16), transparent 20%)",
            ['--glow-x' as string]: glowX,
            ['--glow-y' as string]: glowY,
          }}
        />
      </div>

      <motion.div style={{ x: parallaxX, y: parallaxY }} aria-hidden="true" className="pointer-events-none absolute right-[4%] top-1/2 hidden -translate-y-1/2 lg:block">
        <div className="text-[clamp(7rem,17vw,14rem)] font-black leading-[0.84] tracking-[-0.08em] text-white/[0.05]">
          <div>RAYNK</div>
          <div>LABS</div>
        </div>
      </motion.div>

      <motion.div animate={reducedMotion ? undefined : { y: [0, -14, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute left-[10%] top-[20%] hidden h-24 w-24 rounded-full border border-white/10 bg-white/[0.04] md:block" />
      <motion.div animate={reducedMotion ? undefined : { y: [0, 18, 0], x: [0, 10, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute right-[18%] top-[24%] hidden h-16 w-16 rounded-[1.5rem] border border-primary/20 bg-primary/10 md:block" />

      <div className="relative z-10 section-container flex min-h-[64svh] items-center py-24 sm:py-28 lg:py-32">
        <motion.div initial={reducedMotion ? false : "hidden"} animate={reducedMotion ? undefined : "visible"} variants={heroStagger} className="max-w-4xl">
          <motion.div variants={heroItem} className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-primary backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5" />
            Premium Digital Services
          </motion.div>
          <motion.h1 variants={heroItem} className="max-w-4xl text-balance text-4xl font-black leading-[0.95] tracking-[-0.05em] text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </motion.h1>
          {subtitle ? <motion.p variants={heroItem} className="mt-6 max-w-2xl text-pretty text-base leading-7 text-white/72 sm:text-lg sm:leading-8 md:text-xl">{subtitle}</motion.p> : null}
          <motion.div variants={heroItem} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full px-7 shadow-[0_18px_60px_-20px_rgba(59,130,246,0.78)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_24px_72px_-18px_rgba(59,130,246,0.94)]">
              <a href="#section2-services-grid">Explore Services<ArrowRight className="h-4 w-4" /></a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-white/12 bg-white/[0.04] px-7 text-foreground backdrop-blur-xl transition duration-300 hover:border-primary/30 hover:bg-white/[0.08] hover:shadow-[0_0_40px_-18px_rgba(59,130,246,0.45)]">
              <a href="#section5-services-contact-cta">Start Your Project</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
