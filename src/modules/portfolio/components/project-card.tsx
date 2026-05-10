import Link from "next/link";
import { ArrowUpRight, ExternalLink, GitFork, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/common/safe-image";
import type { ProjectItem } from "../types";

interface ProjectCardProps {
  project: ProjectItem;
  onPreview?: (project: ProjectItem) => void;
  priority?: boolean;
}

export function ProjectCard({ project, onPreview, priority = false }: ProjectCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-video overflow-hidden">
        <SafeImage
          src={project.image}
          alt={project.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onPreview?.(project)}
            aria-label={`Preview ${project.title}`}
          >
            Preview
          </Button>
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <ExternalLink className="w-4 h-4" />
              View Live
            </Link>
          )}
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/80"
            >
              <GitFork className="w-4 h-4" />
              GitHub
            </Link>
          )}
        </div>
      </div>
      <div className="p-5">
        <span className="mb-3 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          {project.category}
        </span>
        <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-primary">
          {project.title}
        </h3>
        {project.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>
        )}
        <button
          type="button"
          onClick={() => onPreview?.(project)}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary outline-none transition-colors hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Open ${project.title} project preview`}
        >
          Case snapshot
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {project.isFeatured && (
        <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-yellow-500/90 px-2.5 py-1 text-xs font-medium text-black">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          Featured
        </div>
      )}
    </article>
  );
}
