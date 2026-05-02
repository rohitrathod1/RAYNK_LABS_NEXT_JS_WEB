"use client";

import { motion } from "framer-motion";
import type { CategoriesFilterSection } from "../types";
import { fadeIn } from "@/lib/animation-variants";

interface FilterProps {
  data: CategoriesFilterSection;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ data, activeCategory, onCategoryChange }: FilterProps) {
  const categories = data.categories.length > 0 ? data.categories : ["All"];

  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeIn}
          className="space-y-6"
        >
          {data.title && (
            <h2 className="text-2xl sm:text-3xl font-bold text-center gradient-text">
              {data.title}
            </h2>
          )}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
