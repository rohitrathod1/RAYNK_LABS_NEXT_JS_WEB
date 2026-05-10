"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SafeImage } from "@/components/common/safe-image";
import type { TestimonialsSection } from "../types";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/animation-variants";
import { PORTFOLIO_SECTIONS } from "../constants";

export function PortfolioTestimonials({ data }: { data: TestimonialsSection }) {
  return (
    <section id={PORTFOLIO_SECTIONS.testimonials} className="section-padding scroll-mt-24 bg-background">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={staggerContainer}
          className="space-y-12"
        >
          <motion.div variants={fadeIn} className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text">
              {data.title}
            </h2>
            {data.subtitle && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {data.subtitle}
              </p>
            )}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.testimonials.map((testimonial, index) => (
              <motion.figure
                key={index}
                variants={staggerItem}
                className="rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>

                <blockquote className="mb-6 leading-relaxed text-muted-foreground italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                <figcaption className="flex items-center gap-3 border-t border-border pt-4">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <SafeImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
