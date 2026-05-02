"use client";

import { useState } from "react";
import { CategoryFilter, ProjectsGrid, PortfolioTestimonials, PortfolioCta } from "@/modules/portfolio/components";
import { PortfolioHero } from "@/modules/portfolio/components/hero";
import type { PortfolioPageData, ProjectItem } from "@/modules/portfolio/types";

interface PortfolioPageProps {
  data: PortfolioPageData;
  projects: ProjectItem[];
}

export default function PortfolioPageClient({ data, projects }: PortfolioPageProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <main className="flex flex-col">
      <PortfolioHero data={data.hero} />
      <CategoryFilter
        data={data.categories_filter}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <ProjectsGrid data={data.projects_grid} projects={filteredProjects} />
      <PortfolioTestimonials data={data.testimonials} />
      <PortfolioCta data={data.contact_cta} />
    </main>
  );
}
