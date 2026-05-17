"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cardReveal, staggerContainer, staggerItem } from "@/lib/animation-variants";
import type { ServiceCard } from "../types";
import { ServiceIcon } from "./shared/icon";

export function ServicesGrid({
  services,
  onSelectService,
}: {
  services: ServiceCard[];
  onSelectService: (serviceName: string) => void;
}) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={staggerContainer} className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service) => (
        <motion.article key={service.title} variants={staggerItem} whileHover={{ y: -8, scale: 1.01 }} transition={{ type: "spring", stiffness: 220, damping: 18 }} className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-background/90 p-6 shadow-[0_18px_60px_-36px_rgba(15,23,42,0.9)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_42%),linear-gradient(180deg,transparent,rgba(168,85,247,0.08))] opacity-0 transition duration-500 group-hover:opacity-100" />
          <div className="absolute inset-0 rounded-[2rem] p-px [background:linear-gradient(145deg,rgba(59,130,246,0.52),rgba(255,255,255,0.06),rgba(168,85,247,0.28))] opacity-45 transition duration-500 group-hover:opacity-100"><div className="h-full w-full rounded-[calc(2rem-1px)] bg-transparent" /></div>
          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-primary/10 text-primary transition duration-300 group-hover:scale-110 group-hover:bg-primary/16">
                <ServiceIcon name={service.icon} className="h-6 w-6 transition duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3" />
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">{service.category.replace(/-/g, " ")}</span>
            </div>
            <h3 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">{service.title}</h3>
            <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">{service.description}</p>
            <div className="mt-8">
              <Button type="button" variant="outline" onClick={() => onSelectService(service.title)} className="h-11 rounded-full border-white/10 bg-white/[0.03] px-5 text-foreground transition duration-300 hover:border-primary/30 hover:bg-primary/10 hover:text-primary">
                Get Service
                <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}
