"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import type { TestimonialsSection } from "../types";
import { HOME_IMAGE_SIZES } from "../constants";
import { resolveHomeImageSrc } from "./shared/image-url";
import { Reveal } from "./shared/reveal";
import { HomeSectionHeading } from "./shared/section-heading";

export function TestimonialsSection({ data }: { data: TestimonialsSection }) {
  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <div className="space-y-12">
          <Reveal>
            <HomeSectionHeading title={data.title} subtitle={data.subtitle} />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.testimonials.map((testimonial, index) => (
              <Reveal key={`${testimonial.name}-${index}`} delay={index * 0.05}>
                <figure className="h-full rounded-xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
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
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-muted">
                    <Image
                      src={resolveHomeImageSrc(testimonial.avatar)}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      sizes={HOME_IMAGE_SIZES.avatar}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
