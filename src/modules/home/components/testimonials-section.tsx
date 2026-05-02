"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SafeImage } from "@/components/common/safe-image";
import type { TestimonialsSection } from "../types";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/animation-variants";

export function TestimonialsSection({ data }: { data: TestimonialsSection }) {
  return (
    <section className="section-padding bg-background">
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
              <motion.div
                key={index}
                variants={staggerItem}
                className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-300"
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

                <blockquote className="text-muted-foreground leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
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
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
