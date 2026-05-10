"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { LazyOnView } from "@/components/shared/lazy-on-view";
import { SectionSkeleton } from "@/components/common/section-skeleton";
import type { PortfolioPageData, ProjectItem } from "@/modules/portfolio/types";

const PortfolioShowcase = dynamic(
  () => import("@/modules/portfolio/components/portfolio-showcase").then((m) => m.PortfolioShowcase),
  { loading: () => <SectionSkeleton /> },
);

const PortfolioTestimonials = dynamic(
  () => import("@/modules/portfolio/components/testimonials").then((m) => m.PortfolioTestimonials),
  { loading: () => <SectionSkeleton /> },
);

const PortfolioCta = dynamic(
  () => import("@/modules/portfolio/components/cta").then((m) => m.PortfolioCta),
  { loading: () => <SectionSkeleton /> },
);

interface PortfolioPageProps {
  data: PortfolioPageData;
  projects: ProjectItem[];
}

export default function PortfolioPageClient({ data, projects }: PortfolioPageProps) {
  return (
    <>
      <LazyOnView fallback={<SectionSkeleton />} rootMargin="450px" minHeight={520}>
        <Suspense fallback={<SectionSkeleton />}>
          <PortfolioShowcase
            filter={data.categories_filter}
            grid={data.projects_grid}
            projects={projects}
          />
        </Suspense>
      </LazyOnView>

      <LazyOnView fallback={<SectionSkeleton />} rootMargin="400px" minHeight={420}>
        <Suspense fallback={<SectionSkeleton />}>
          <PortfolioTestimonials data={data.testimonials} />
        </Suspense>
      </LazyOnView>

      <LazyOnView fallback={<SectionSkeleton />} rootMargin="350px" minHeight={280}>
        <Suspense fallback={<SectionSkeleton />}>
          <PortfolioCta data={data.contact_cta} />
        </Suspense>
      </LazyOnView>
    </>
  );
}
