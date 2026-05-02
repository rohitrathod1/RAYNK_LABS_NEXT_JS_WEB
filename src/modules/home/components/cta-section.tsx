"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { CtaSection } from "../types";
import { fadeIn } from "@/lib/animation-variants";

export function CtaSection({ data }: { data: CtaSection }) {
  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeIn}
          className="text-center space-y-8 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            {data.heading}
          </h2>
          {data.subheading && (
            <p className="text-lg text-white/80 leading-relaxed">
              {data.subheading}
            </p>
          )}
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="text-base px-8 py-6"
          >
            <Link href={data.ctaHref}>{data.ctaText}</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
