"use client";

import { motion } from "framer-motion";
import { timelineReveal } from "@/lib/animation-variants";
import type { ProcessSection } from "../types";
import { ServiceIcon } from "./shared/icon";

export function Process({ title, subtitle, steps }: ProcessSection) {
  return (
    <section id="section4-services-work-process" className="section-padding scroll-mt-24 bg-background">
      <div className="section-container">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
          {subtitle ? <p className="mt-4 text-pretty text-lg text-muted-foreground">{subtitle}</p> : null}
        </div>

        <div className="relative">
          <div className="absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0 md:block xl:left-[calc(12.5%-0.5px)] xl:w-[75%] xl:h-px xl:top-10 xl:bg-gradient-to-r xl:from-primary/0 xl:via-primary/30 xl:to-primary/0" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <motion.article
                key={step.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={timelineReveal}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-[1.85rem] border border-white/10 bg-background/90 p-6 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.95)]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_44%),linear-gradient(180deg,transparent,rgba(168,85,247,0.08))] opacity-0 transition duration-500 group-hover:opacity-100" />
                <div className="absolute left-5 top-8 hidden h-10 w-px bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0 md:block xl:hidden" />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/12 text-primary shadow-[0_0_0_10px_rgba(59,130,246,0.08)] transition duration-300 group-hover:shadow-[0_0_0_14px_rgba(59,130,246,0.12)]">
                      <span className="text-sm font-bold">{step.step}</span>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-primary transition duration-300 group-hover:scale-110 group-hover:bg-primary/12">
                      <ServiceIcon name={step.icon} className="h-5 w-5 transition duration-300 group-hover:rotate-6" />
                    </div>
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">{step.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{step.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
