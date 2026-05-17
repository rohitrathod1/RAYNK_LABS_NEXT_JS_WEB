"use client";

import { motion } from "framer-motion";
import { cardReveal, staggerContainer } from "@/lib/animation-variants";
import type { WhyChooseSection } from "../types";
import { ServiceIcon } from "./shared/icon";

export function WhyChoose({ title, subtitle, points }: WhyChooseSection) {
  return (
    <section id="section3-services-benefits" className="section-padding scroll-mt-24 bg-muted/20">
      <div className="section-container">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
          {subtitle ? <p className="mt-4 text-pretty text-lg text-muted-foreground">{subtitle}</p> : null}
        </div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer} className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {points.map((point) => (
            <motion.article key={point.title} variants={cardReveal} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 220, damping: 18 }} className="rounded-[1.75rem] border border-white/10 bg-background/80 p-6 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.9)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><ServiceIcon name={point.icon} className="h-5 w-5" /></div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">{point.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{point.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
