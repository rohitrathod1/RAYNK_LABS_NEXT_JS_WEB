"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Rocket,
  Users,
  Star,
  Heart,
  Code,
  Unlock,
  Zap,
  Shield,
  Globe,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { staggerContainer, slideUp, staggerItem } from "@/lib/animation-variants";
import type { HealthBenefitsSection as HealthBenefitsSectionType } from "../types";

const ICON_MAP: Record<string, LucideIcon> = {
  Rocket,
  Users,
  Star,
  Heart,
  Code,
  Unlock,
  Zap,
  Shield,
  Globe,
  BookOpen,
};

export function HealthBenefitsSection({ data }: { data: HealthBenefitsSectionType }) {
  const reduced = useReducedMotion();
  const containerVariants = reduced ? {} : staggerContainer;
  const itemVariants = reduced ? {} : staggerItem;

  return (
    <section className="py-20 bg-muted/30">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.benefits.map((benefit, i) => {
              const IconComponent = ICON_MAP[benefit.icon] ?? Zap;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
