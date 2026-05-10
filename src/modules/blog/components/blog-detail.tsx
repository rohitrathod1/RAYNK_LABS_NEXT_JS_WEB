import { SafeImage } from "@/components/common/safe-image";
import Link from "next/link";
import { ArrowLeft, Clock, Share2 } from "lucide-react";
import type { BlogPostItem } from "../types";
import { BLOG_SECTIONS } from "../constants";
import { estimateReadingTime, formatBlogDate } from "../utils";
import { ReadingProgress } from "./reading-progress";

interface BlogDetailProps {
  post: BlogPostItem;
  relatedPosts: BlogPostItem[];
}

export function BlogDetail({ post, relatedPosts }: BlogDetailProps) {
  const dateStr = formatBlogDate(post);
  const readTime = estimateReadingTime(post.content);

  return (
    <article className="min-h-screen">
      <ReadingProgress />
      <section id="section1-article-hero" className="relative h-[58vh] min-h-[380px] scroll-mt-24">
        <SafeImage
          src={post.coverImage ?? ""}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
        <div className="section-container section-padding absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
              <span className="font-medium text-white">{post.author}</span>
              <span>&middot;</span>
              <time dateTime={dateStr}>{dateStr}</time>
              <span>&middot;</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {readTime} min read
              </span>
              {post.tags.length > 0 && (
                <>
                  <span>&middot;</span>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded-full bg-white/20 px-2.5 py-1 text-xs text-white">
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      <div className="section-container section-padding">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-3 rounded-xl border border-border bg-card p-4 text-sm shadow-sm">
              <p className="font-semibold">On this page</p>
              <a href="#section2-article-content" className="block text-muted-foreground hover:text-primary">
                Article
              </a>
              <a href="#section3-article-tags" className="block text-muted-foreground hover:text-primary">
                Tags
              </a>
              <a href={`#${BLOG_SECTIONS.related}`} className="block text-muted-foreground hover:text-primary">
                Related
              </a>
            </div>
          </aside>

          <div className="min-w-0">
            <div
              id="section2-article-content"
              className="prose prose-lg max-w-none scroll-mt-24
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
              <div id="section3-article-tags" className="mt-12 scroll-mt-24 border-t border-border pt-8">
                <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-primary/10 px-3 py-1.5 text-sm text-primary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {relatedPosts.length > 0 && (
              <div id={BLOG_SECTIONS.related} className="mt-16 scroll-mt-24 border-t border-border pt-8">
                <h2 className="mb-6 text-2xl font-bold">Related Articles</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related.id}
                      href={`/blog/${related.slug}`}
                      className="group rounded-xl border border-border bg-card p-4 transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative mb-3 aspect-video overflow-hidden rounded-lg">
                        <SafeImage
                          src={related.coverImage ?? ""}
                          alt={related.title}
                          fill
                          sizes="33vw"
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <h3 className="line-clamp-2 text-sm font-semibold transition-colors group-hover:text-primary">
                        {related.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">{formatBlogDate(related)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
              <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:underline">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to all articles
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Share2 className="h-4 w-4" aria-hidden="true" />
                Share this article
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

