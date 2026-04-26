"use client";

import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, slideUp, slideInLeft, slideInRight } from "@/lib/animation-variants";
import { SafeImage } from "@/components/common/safe-image";
import type { MissionSection as MissionSectionType } from "../types";

export function MissionSection({ data }: { data: MissionSectionType }) {
  const reduced = useReducedMotion();
  const containerVariants = reduced ? {} : staggerContainer;
  const itemVariants = reduced ? {} : slideUp;

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.div variants={reduced ? {} : slideInLeft} className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{data.title}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">{data.body}</p>

            {data.stats.length > 0 && (
              <div className="grid grid-cols-2 gap-6 pt-4">
                {data.stats.map((stat, i) => (
                  <motion.div key={i} variants={itemVariants} className="space-y-1">
                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            variants={reduced ? {} : slideInRight}
            className="relative aspect-square rounded-2xl overflow-hidden bg-muted"
          >
            <SafeImage src={data.image} alt={data.title} fill className="object-cover" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
