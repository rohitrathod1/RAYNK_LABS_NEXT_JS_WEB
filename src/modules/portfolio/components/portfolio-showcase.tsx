"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Filter, GitFork, MonitorSmartphone, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/common/safe-image";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/animation-variants";
import { PORTFOLIO_CATEGORY_ALL, PORTFOLIO_FALLBACK_TECHNOLOGIES, PORTFOLIO_SECTIONS } from "../constants";
import type { CategoriesFilterSection, ProjectItem, ProjectsGridSection } from "../types";
import { ProjectCard } from "./project-card";

interface PortfolioShowcaseProps {
  filter: CategoriesFilterSection;
  grid: ProjectsGridSection;
  projects: ProjectItem[];
}

function getProjectTechnologies(project: ProjectItem) {
  const haystack = `${project.title} ${project.category} ${project.description ?? ""}`.toLowerCase();
  return PORTFOLIO_FALLBACK_TECHNOLOGIES.filter((technology) =>
    haystack.includes(technology.toLowerCase().replace(".", "")) ||
    haystack.includes(technology.toLowerCase()),
  ) as string[];
}

export function PortfolioShowcase({ filter, grid, projects }: PortfolioShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState(PORTFOLIO_CATEGORY_ALL);
  const [activeTechnology, setActiveTechnology] = useState(PORTFOLIO_CATEGORY_ALL);
  const [previewProject, setPreviewProject] = useState<ProjectItem | null>(null);

  const categories = useMemo(() => {
    const cmsCategories = filter.categories.length > 0 ? filter.categories : [PORTFOLIO_CATEGORY_ALL];
    return cmsCategories.includes(PORTFOLIO_CATEGORY_ALL)
      ? cmsCategories
      : [PORTFOLIO_CATEGORY_ALL, ...cmsCategories];
  }, [filter.categories]);

  const technologies = useMemo(() => {
    const discovered = new Set<string>();
    projects.forEach((project) => getProjectTechnologies(project).forEach((item) => discovered.add(item)));
    const values = discovered.size > 0 ? Array.from(discovered) : Array.from(PORTFOLIO_FALLBACK_TECHNOLOGIES);
    return [PORTFOLIO_CATEGORY_ALL, ...values];
  }, [projects]);

  const featuredProjects = useMemo(
    () => projects.filter((project) => project.isFeatured).slice(0, 3),
    [projects],
  );

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        const categoryMatch =
          activeCategory === PORTFOLIO_CATEGORY_ALL || project.category === activeCategory;
        const technologyMatch =
          activeTechnology === PORTFOLIO_CATEGORY_ALL ||
          getProjectTechnologies(project).includes(activeTechnology);
        return categoryMatch && technologyMatch;
      }),
    [activeCategory, activeTechnology, projects],
  );

  return (
    <>
      <section
        id={PORTFOLIO_SECTIONS.featured}
        className="scroll-mt-24 bg-background py-16 sm:py-20"
      >
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            variants={staggerContainer}
            className="space-y-10"
          >
            <motion.div variants={fadeIn} className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Featured case studies
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">
                High-impact builds with measurable polish.
              </h2>
            </motion.div>
            <div className="grid gap-6 lg:grid-cols-3">
              {(featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 3)).map((project, index) => (
                <motion.div key={project.id} variants={staggerItem}>
                  <ProjectCard
                    project={project}
                    priority={index === 0}
                    onPreview={setPreviewProject}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id={PORTFOLIO_SECTIONS.grid}
        className="scroll-mt-24 bg-muted/30 py-16 sm:py-20"
      >
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.14 }}
            variants={staggerContainer}
            className="space-y-10"
          >
            <motion.div variants={fadeIn} className="mx-auto max-w-3xl text-center">
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
                <Filter className="h-4 w-4" aria-hidden="true" />
                {filter.title}
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">{grid.title}</h2>
              {grid.subtitle && (
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{grid.subtitle}</p>
              )}
            </motion.div>

            <motion.div variants={fadeIn} className="space-y-4 rounded-xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur">
              <div className="flex flex-wrap gap-2" aria-label="Filter projects by category">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      activeCategory === category
                        ? "bg-primary text-primary-foreground shadow"
                        : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2" aria-label="Filter projects by technology">
                {technologies.map((technology) => (
                  <button
                    key={technology}
                    type="button"
                    onClick={() => setActiveTechnology(technology)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      activeTechnology === technology
                        ? "bg-foreground text-background shadow"
                        : "bg-background text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
                    }`}
                  >
                    {technology}
                  </button>
                ))}
              </div>
            </motion.div>

            <AnimatePresence mode="popLayout">
              {filteredProjects.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  className="rounded-xl border border-dashed border-border bg-background p-10 text-center"
                >
                  <Search className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
                  <p className="mt-4 text-lg font-semibold">No matching projects yet.</p>
                  <p className="mt-2 text-muted-foreground">Try another category or technology filter.</p>
                </motion.div>
              ) : (
                <motion.div
                  key={`${activeCategory}-${activeTechnology}`}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={staggerContainer}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {filteredProjects.map((project) => (
                    <motion.div key={project.id} layout variants={staggerItem}>
                      <ProjectCard project={project} onPreview={setPreviewProject} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section
        id={PORTFOLIO_SECTIONS.caseStudies}
        className="scroll-mt-24 bg-background py-16 sm:py-20"
      >
        <div className="section-container grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.24 }}
            variants={fadeIn}
            className="space-y-4"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Case study method</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Strategy, build, launch, then optimize.</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Every portfolio project is shaped around business outcomes: discovery, UX structure,
              fast implementation, measurable launch quality, and room for continuous improvement.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.24 }}
            variants={staggerContainer}
            className="grid gap-4 sm:grid-cols-2"
          >
            {["Discovery", "Design System", "Engineering", "Growth"].map((step, index) => (
              <motion.div
                key={step}
                variants={staggerItem}
                className="rounded-xl border border-border bg-card p-6 shadow-sm transition-transform hover:-translate-y-1"
              >
                <span className="text-sm font-semibold text-primary">0{index + 1}</span>
                <h3 className="mt-3 text-xl font-semibold">{step}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  A focused phase that keeps the project understandable, testable, and ready for scale.
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        id={PORTFOLIO_SECTIONS.technologies}
        className="scroll-mt-24 bg-muted/30 py-16 sm:py-20"
      >
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div variants={fadeIn}>
              <MonitorSmartphone className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Technology that fits the work.</h2>
            </motion.div>
            <motion.div variants={staggerContainer} className="mt-8 flex flex-wrap justify-center gap-3">
              {technologies.filter((item) => item !== PORTFOLIO_CATEGORY_ALL).map((technology) => (
                <motion.span
                  key={technology}
                  variants={staggerItem}
                  className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm"
                >
                  {technology}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Dialog open={Boolean(previewProject)} onOpenChange={(open) => !open && setPreviewProject(null)}>
        <DialogContent className="max-w-3xl overflow-hidden p-0">
          {previewProject && (
            <>
              <div className="relative aspect-video">
                <SafeImage
                  src={previewProject.image}
                  alt={previewProject.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPreviewProject(null)}
                  className="absolute right-3 top-3 rounded-full bg-background/90 p-2 text-foreground shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Close project preview"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="space-y-5 p-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{previewProject.title}</DialogTitle>
                  <DialogDescription>{previewProject.description}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {previewProject.category}
                  </span>
                  {getProjectTechnologies(previewProject).map((technology) => (
                    <span key={technology} className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                      {technology}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href={`/portfolio/${previewProject.slug}`}>
                      Open Case Study
                      <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  {previewProject.liveUrl && (
                    <Button asChild variant="outline">
                      <Link href={previewProject.liveUrl} target="_blank" rel="noopener noreferrer">
                        Live Preview
                      </Link>
                    </Button>
                  )}
                  {previewProject.githubUrl && (
                    <Button asChild variant="outline">
                      <Link href={previewProject.githubUrl} target="_blank" rel="noopener noreferrer">
                        <GitFork className="mr-2 h-4 w-4" aria-hidden="true" />
                        GitHub
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
