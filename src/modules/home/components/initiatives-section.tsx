"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { InitiativesSection } from "../types";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/animation-variants";

export function InitiativesSection({ data }: { data: InitiativesSection }) {
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.cards.map((card, index) => {
              const IconComponent = Icons[card.icon as keyof typeof Icons] as React.ElementType;
              return (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="group p-6 rounded-xl border border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    {IconComponent && (
                      <IconComponent className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{card.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
