"use client";

import { ArrowRight, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cardReveal } from "@/lib/animation-variants";
import type { ContactCtaSection } from "../types";

export function ContactCta({
  heading,
  subheading,
  ctaText,
  secondaryCtaText,
  trustIndicators,
  onPrimaryAction,
  onSecondaryAction,
}: ContactCtaSection & { onPrimaryAction: () => void; onSecondaryAction: () => void }) {
  return (
    <section id="section5-services-contact-cta" className="section-padding scroll-mt-24 bg-background">
      <div className="section-container">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={cardReveal} className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_28%),rgba(255,255,255,0.03)] px-6 py-12 text-center shadow-[0_28px_80px_-44px_rgba(15,23,42,1)] backdrop-blur-2xl sm:px-10 sm:py-16">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_40%,rgba(59,130,246,0.08))]" />
          <div className="relative mx-auto max-w-3xl space-y-6">
            <div className="flex flex-wrap justify-center gap-3">
              {trustIndicators.map((indicator) => (
                <span key={indicator} className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                  {indicator}
                </span>
              ))}
            </div>
            <h2 className="text-balance text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl">{heading}</h2>
            {subheading ? <p className="text-pretty text-lg leading-8 text-white/72">{subheading}</p> : null}
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button type="button" size="lg" onClick={onPrimaryAction} className="h-12 rounded-full px-7 shadow-[0_18px_60px_-20px_rgba(59,130,246,0.8)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_24px_72px_-18px_rgba(59,130,246,0.94)]">
                {ctaText}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button type="button" size="lg" variant="outline" onClick={onSecondaryAction} className="h-12 rounded-full border-white/12 bg-white/[0.04] px-7 text-foreground backdrop-blur-xl transition duration-300 hover:border-primary/30 hover:bg-primary/10 hover:text-primary">
                {secondaryCtaText}
                <CalendarDays className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
