"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Category, ServiceCard } from "../types";
import { ServicesGrid } from "./services-grid";

const Button = dynamic(() => import("@/components/ui/button").then((mod) => mod.Button));

export function Categories({
  categories,
  services,
}: {
  categories: Category[];
  services: ServiceCard[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredServices =
    activeCategory === "all"
      ? services
      : services.filter((s) => s.category === activeCategory);

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        <Button
          variant={activeCategory === "all" ? "default" : "outline"}
          onClick={() => setActiveCategory("all")}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? "default" : "outline"}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.name}
          </Button>
        ))}
      </div>
      <ServicesGrid services={filteredServices} />
    </section>
  );
}
