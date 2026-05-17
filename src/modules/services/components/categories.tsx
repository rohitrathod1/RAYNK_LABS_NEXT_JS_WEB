"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cardReveal, staggerContainer } from "@/lib/animation-variants";
import type { Category, ServiceCard } from "../types";
import { ServiceIcon } from "./shared/icon";
import { ServicesGrid } from "./services-grid";

export function Categories({
  categories,
  services,
  onSelectService,
}: {
  categories: Category[];
  services: ServiceCard[];
  onSelectService: (serviceName: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredServices = useMemo(
    () => (activeCategory === "all" ? services : services.filter((service) => service.category === activeCategory)),
    [activeCategory, services],
  );

  return (
    <section id="section2-services-grid" className="section-padding scroll-mt-24 bg-background">
      <div className="section-container space-y-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer} className="flex flex-wrap justify-center gap-3">
          <motion.div variants={cardReveal}>
            <Button variant={activeCategory === "all" ? "default" : "outline"} onClick={() => setActiveCategory("all")} className={`h-11 rounded-full px-5 ${activeCategory === "all" ? "shadow-[0_14px_36px_-16px_rgba(59,130,246,0.76)]" : "border-white/10 bg-white/[0.03] text-foreground hover:border-primary/30 hover:bg-white/[0.05]"}`}>
              All
            </Button>
          </motion.div>
          {categories.map((category) => (
            <motion.div key={category.id} variants={cardReveal}>
              <Button variant={activeCategory === category.id ? "default" : "outline"} onClick={() => setActiveCategory(category.id)} className={`group h-11 rounded-full px-5 ${activeCategory === category.id ? "shadow-[0_14px_36px_-16px_rgba(59,130,246,0.76)]" : "border-white/10 bg-white/[0.03] text-foreground hover:border-primary/30 hover:bg-white/[0.05]"}`}>
                <ServiceIcon name={category.icon} className="mr-2 h-4 w-4 transition group-hover:rotate-6 group-hover:scale-110" />
                {category.name}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        <ServicesGrid services={filteredServices} onSelectService={onSelectService} />
      </div>
    </section>
  );
}
