"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SafeImage } from "@/components/common/safe-image";
import type { PortfolioSection } from "../types";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/animation-variants";

export function PortfolioSection({ data }: { data: PortfolioSection }) {
  return (
    <section className="section-padding bg-muted/30">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((item, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="group relative rounded-xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300"
              >
                <Link href={item.href} className="block">
                  <div className="relative aspect-video overflow-hidden">
                    <SafeImage
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
