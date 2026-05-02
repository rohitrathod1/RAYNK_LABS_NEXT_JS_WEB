import { SafeImage } from "@/components/common/safe-image";
import Link from "next/link";
import type { BlogPostItem } from "../types";

interface BlogDetailProps {
  post: BlogPostItem;
  relatedPosts: BlogPostItem[];
}

export function BlogDetail({ post, relatedPosts }: BlogDetailProps) {
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
    <article className="min-h-screen">
      <div className="relative h-[50vh] min-h-[300px]">
        <SafeImage
          src={post.coverImage ?? ""}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 section-container section-padding">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
              <span className="font-medium text-white">{post.author}</span>
              <span>&middot;</span>
              <time dateTime={dateStr}>{dateStr}</time>
              {post.tags.length > 0 && (
                <>
                  <span>&middot;</span>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-xs rounded-full bg-white/20 text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="section-container section-padding">
        <div className="max-w-4xl mx-auto">
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-foreground
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground
              prose-img:rounded-xl prose-img:shadow-lg
              prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg
              prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg
              prose-hr:border-border
              prose-li:text-muted-foreground
              prose-ul:list-disc prose-ol:list-decimal"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 text-sm rounded-full bg-primary/10 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-8 border-t border-border">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((related) => {
                  const relatedDate = related.publishedAt
                    ? new Date(related.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "";

                  return (
                    <Link
                      key={related.id}
                      href={`/blog/${related.slug}`}
                      className="group rounded-lg border border-border bg-card p-4 hover:shadow-lg transition"
                    >
                      <div className="relative aspect-video rounded-md overflow-hidden mb-3">
                        <SafeImage
                          src={related.coverImage ?? ""}
                          alt={related.title}
                          fill
                          sizes="33vw"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">{relatedDate}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-border text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              &larr; Back to all articles
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
