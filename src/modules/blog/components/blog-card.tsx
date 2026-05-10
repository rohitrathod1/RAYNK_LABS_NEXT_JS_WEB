import { SafeImage } from "@/components/common/safe-image";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { BlogPostItem } from "../types";
import { estimateReadingTime, formatBlogDate, getPrimaryTag } from "../utils";

export function BlogCard({ post, priority = false }: { post: BlogPostItem; priority?: boolean }) {
  const dateStr = formatBlogDate(post);
  const readTime = estimateReadingTime(post.content);
  const category = getPrimaryTag(post);

  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          <SafeImage
            src={post.coverImage ?? ""}
            alt={post.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent opacity-80" />
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            {category}
          </span>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>{post.author}</span>
            <span>&middot;</span>
            <time dateTime={dateStr}>{dateStr}</time>
            <span>&middot;</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {readTime} min read
            </span>
          </div>
          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-muted-foreground text-sm line-clamp-3">
              {post.excerpt}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-2">
            <span className="text-sm font-medium text-primary group-hover:underline">
              Read More
            </span>
            <ArrowUpRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </article>
  );
}
