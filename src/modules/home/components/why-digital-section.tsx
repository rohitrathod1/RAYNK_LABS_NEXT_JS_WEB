"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { SafeImage } from "@/components/common/safe-image";
import type { WhyDigitalSection } from "../types";
import { fadeIn, slideInLeft, slideInRight } from "@/lib/animation-variants";

export function WhyDigitalSection({ data }: { data: WhyDigitalSection }) {
  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={slideInLeft}
            className="relative rounded-2xl overflow-hidden aspect-square lg:aspect-auto lg:h-full min-h-[300px]"
          >
            <SafeImage
              src={data.image}
              alt={data.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={slideInRight}
            className="space-y-6"
          >
            <motion.div variants={fadeIn} className="space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text">
                {data.title}
              </h2>
              {data.subtitle && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {data.subtitle}
                </p>
              )}
            </motion.div>

            <ul className="space-y-4">
              {data.bulletPoints.map((point, index) => (
                <motion.li
                  key={index}
                  variants={fadeIn}
                  custom={index}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground leading-relaxed">{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
