import { SafeImage } from "@/components/common/safe-image";
import Link from "next/link";
import type { BlogPostItem } from "../types";

export function BlogCard({ post }: { post: BlogPostItem }) {
  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  return (
    <article className="group rounded-xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          <SafeImage
            src={post.coverImage ?? ""}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{post.author}</span>
            <span>&middot;</span>
            <time dateTime={dateStr}>{dateStr}</time>
          </div>
          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-muted-foreground text-sm line-clamp-3">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-sm font-medium text-primary group-hover:underline">
              Read More
            </span>
            <span className="text-primary transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
