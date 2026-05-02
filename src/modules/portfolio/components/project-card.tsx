import Link from "next/link";
import { ExternalLink, GitFork } from "lucide-react";
import { SafeImage } from "@/components/common/safe-image";
import type { ProjectItem } from "../types";

export function ProjectCard({ project }: { project: ProjectItem }) {
  return (
    <div className="group relative rounded-xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-video overflow-hidden">
        <SafeImage
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium text-sm hover:bg-white/90 transition-colors"
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
              className="flex items-center gap-2 px-4 py-2 bg-black text-white border border-white/30 rounded-lg font-medium text-sm hover:bg-black/80 transition-colors"
            >
              <GitFork className="w-4 h-4" />
              GitHub
            </Link>
          )}
        </div>
      </div>
      <div className="p-5">
        <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mb-2">
          {project.category}
        </span>
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        {project.description && (
          <p className="text-muted-foreground text-sm line-clamp-2">
            {project.description}
          </p>
        )}
      </div>
      {project.isFeatured && (
        <div className="absolute top-3 right-3 px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-500/90 text-black">
          Featured
        </div>
      )}
    </div>
  );
}
