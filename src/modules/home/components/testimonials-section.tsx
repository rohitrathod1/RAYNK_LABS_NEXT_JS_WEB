"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { staggerContainer, slideUp, staggerItem } from "@/lib/animation-variants";
import { SafeImage } from "@/components/common/safe-image";
import type { TestimonialsSection as TestimonialsSectionType } from "../types";

export function TestimonialsSection({ data }: { data: TestimonialsSectionType }) {
  const reduced = useReducedMotion();
  const containerVariants = reduced ? {} : staggerContainer;
  const itemVariants = reduced ? {} : staggerItem;

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-12"
        >
          <motion.div variants={reduced ? {} : slideUp} className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{data.title}</h2>
            {data.subtitle && (
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{data.subtitle}</p>
            )}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="flex flex-col gap-4 p-6 rounded-2xl bg-card border border-border"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0">
                    <SafeImage src={t.avatar} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
