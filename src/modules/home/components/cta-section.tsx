"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { slideUp, staggerContainer } from "@/lib/animation-variants";
import { SafeImage } from "@/components/common/safe-image";
import type { CtaSection as CtaSectionType } from "../types";

export function CtaSection({ data }: { data: CtaSectionType }) {
  const reduced = useReducedMotion();
  const containerVariants = reduced ? {} : staggerContainer;
  const itemVariants = reduced ? {} : slideUp;

  return (
    <section className="relative py-24 overflow-hidden bg-primary">
      {data.backgroundImage && (
        <SafeImage
          src={data.backgroundImage}
          alt="CTA background"
          fill
          className="object-cover opacity-10"
        />
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="space-y-6"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground"
          >
            {data.heading}
          </motion.h2>

          {data.subheading && (
            <motion.p
              variants={itemVariants}
              className="text-lg text-primary-foreground/80 max-w-2xl mx-auto"
            >
              {data.subheading}
            </motion.p>
          )}

          <motion.div variants={itemVariants}>
            <Link
              href={data.ctaHref}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-background text-foreground font-semibold hover:bg-background/90 transition-colors"
            >
              {data.ctaText} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
