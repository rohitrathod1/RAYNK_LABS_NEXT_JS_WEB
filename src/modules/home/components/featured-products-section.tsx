"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { staggerContainer, slideUp, staggerItem } from "@/lib/animation-variants";
import { SafeImage } from "@/components/common/safe-image";
import type { FeaturedProductsSection as FeaturedProductsSectionType } from "../types";

export function FeaturedProductsSection({ data }: { data: FeaturedProductsSectionType }) {
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.products.map((product, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video bg-muted overflow-hidden">
                  <SafeImage
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                  {product.href && (
                    <Link
                      href={product.href}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
                    >
                      Learn more <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
