"use client";

import { motion } from "framer-motion";
import type { ProjectsGridSection, ProjectItem } from "../types";
import { ProjectCard } from "./project-card";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/animation-variants";

interface ProjectsGridProps {
  data: ProjectsGridSection;
  projects: ProjectItem[];
}

export function ProjectsGrid({ data, projects }: ProjectsGridProps) {
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

          {projects.length === 0 ? (
            <motion.div variants={fadeIn} className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No projects found in this category.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <motion.div key={project.id} variants={staggerItem}>
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
