"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CtaSection } from "../types";
import { Reveal } from "./shared/reveal";

export function CtaSection({ data }: { data: CtaSection }) {
  return (
    <section className="section-padding relative overflow-hidden bg-[#070b16] text-white" aria-labelledby="home-cta-title">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(58,121,255,0.32),_transparent_42%),linear-gradient(135deg,_rgba(17,24,39,0.96),_rgba(9,14,26,1))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="section-container relative">
        <Reveal className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.05] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10 lg:p-14">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
              <Sparkles className="h-3.5 w-3.5 text-[#6ea8ff]" />
              Let&apos;s Build Something Better
            </div>

            <div className="space-y-6">
              <h2 id="home-cta-title" className="mx-auto max-w-4xl text-balance text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                {data.heading}
              </h2>
              {data.subheading && (
                <p className="mx-auto max-w-3xl text-pretty text-base leading-8 text-white/72 sm:text-lg md:text-xl">
                  {data.subheading}
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-12 rounded-full bg-[#3b82f6] px-8 text-base text-white shadow-[0_16px_40px_rgba(59,130,246,0.35)] transition hover:-translate-y-0.5 hover:bg-[#2563eb]"
              >
                <Link href={data.ctaHref} className="inline-flex items-center gap-2">
                  {data.ctaText}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
