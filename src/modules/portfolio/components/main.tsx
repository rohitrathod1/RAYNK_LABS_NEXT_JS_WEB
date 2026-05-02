import { PortfolioHero } from "./hero";
import dynamic from "next/dynamic";
import { SectionSkeleton } from "@/components/common/section-skeleton";
import type { PortfolioPageData, ProjectItem } from "../types";

const CategoryFilter = dynamic(
  () => import("./filter").then((m) => m.CategoryFilter),
  { loading: () => <SectionSkeleton /> },
);

const ProjectsGrid = dynamic(
  () => import("./grid").then((m) => m.ProjectsGrid),
  { loading: () => <SectionSkeleton /> },
);

const PortfolioTestimonials = dynamic(
  () => import("./testimonials").then((m) => m.PortfolioTestimonials),
  { loading: () => <SectionSkeleton /> },
);

const PortfolioCta = dynamic(
  () => import("./cta").then((m) => m.PortfolioCta),
  { loading: () => <SectionSkeleton /> },
);

interface PortfolioContentProps {
  data: PortfolioPageData;
  projects: ProjectItem[];
}

export function PortfolioContent({ data, projects }: PortfolioContentProps) {
  return (
    <main className="flex flex-col">
      <PortfolioHero data={data.hero} />
      <CategoryFilter
        data={data.categories_filter}
        activeCategory="All"
        onCategoryChange={() => {}}
      />
      <ProjectsGrid data={data.projects_grid} projects={projects} />
      <PortfolioTestimonials data={data.testimonials} />
      <PortfolioCta data={data.contact_cta} />
    </main>
  );
}
