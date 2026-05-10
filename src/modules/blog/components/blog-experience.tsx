"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Search, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/animation-variants";
import { BLOG_CATEGORY_ALL, BLOG_DEFAULT_CATEGORIES, BLOG_SECTIONS } from "../constants";
import type { BlogListSection, BlogPostItem } from "../types";
import { getPrimaryTag } from "../utils";
import { BlogCard } from "./blog-card";

interface BlogExperienceProps {
  data: BlogListSection;
  posts: BlogPostItem[];
}

export function BlogExperience({ data, posts }: BlogExperienceProps) {
  const [activeCategory, setActiveCategory] = useState(BLOG_CATEGORY_ALL);
  const [activeTag, setActiveTag] = useState(BLOG_CATEGORY_ALL);
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const fromPosts = Array.from(new Set(posts.map(getPrimaryTag)));
    const values = fromPosts.length > 0 ? fromPosts : Array.from(BLOG_DEFAULT_CATEGORIES);
    return [BLOG_CATEGORY_ALL, ...values];
  }, [posts]);

  const tags = useMemo(() => {
    const values = Array.from(new Set(posts.flatMap((post) => post.tags))).slice(0, 18);
    return [BLOG_CATEGORY_ALL, ...values];
  }, [posts]);

  const featuredPosts = useMemo(() => posts.slice(0, 3), [posts]);

  const filteredPosts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return posts.filter((post) => {
      const categoryMatch =
        activeCategory === BLOG_CATEGORY_ALL || getPrimaryTag(post) === activeCategory;
      const tagMatch = activeTag === BLOG_CATEGORY_ALL || post.tags.includes(activeTag);
      const queryMatch =
        !normalized ||
        `${post.title} ${post.excerpt ?? ""} ${post.author} ${post.tags.join(" ")}`
          .toLowerCase()
          .includes(normalized);
      return categoryMatch && tagMatch && queryMatch;
    });
  }, [activeCategory, activeTag, posts, query]);

  return (
    <>
      <section id={BLOG_SECTIONS.featured} className="scroll-mt-24 bg-background py-16 sm:py-20">
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
                Featured reads
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">
                Practical ideas for better digital products.
              </h2>
            </motion.div>
            {featuredPosts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
                No articles published yet. New insights will appear here from the admin CMS.
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-3">
                {featuredPosts.map((post, index) => (
                  <motion.div key={post.id} variants={staggerItem} className={index === 0 ? "lg:col-span-2" : ""}>
                    <BlogCard post={post} priority={index === 0} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section id={BLOG_SECTIONS.categories} className="scroll-mt-24 bg-muted/30 py-12">
        <div className="section-container space-y-5">
          <div className="relative mx-auto max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search articles, authors, or tags"
              className="h-12 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Search blog articles"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2" aria-label="Blog categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-background text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2" aria-label="Blog tags">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  activeTag === tag
                    ? "bg-foreground text-background shadow"
                    : "bg-card text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
                }`}
              >
                <Tags className="h-3.5 w-3.5" aria-hidden="true" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id={BLOG_SECTIONS.grid} className="section-padding scroll-mt-24 bg-background">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.14 }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.div variants={fadeIn} className="space-y-4 text-center">
              <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">{data.title}</h2>
              {data.subtitle && (
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{data.subtitle}</p>
              )}
            </motion.div>
            <AnimatePresence mode="popLayout">
              {filteredPosts.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  className="rounded-xl border border-dashed border-border bg-card p-10 text-center"
                >
                  <p className="text-lg font-semibold">No matching articles found.</p>
                  <p className="mt-2 text-muted-foreground">Try a different search, category, or tag.</p>
                </motion.div>
              ) : (
                <motion.div
                  key={`${activeCategory}-${activeTag}-${query}`}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={staggerContainer}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {filteredPosts.map((post) => (
                    <motion.div key={post.id} layout variants={staggerItem}>
                      <BlogCard post={post} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section id={BLOG_SECTIONS.newsletter} className="section-padding scroll-mt-24 bg-primary text-primary-foreground">
        <div className="section-container text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <Mail className="mx-auto h-10 w-10" aria-hidden="true" />
            <h2 className="text-3xl font-bold sm:text-4xl">Stay close to the next useful idea.</h2>
            <p className="text-lg opacity-90">
              Follow RaYnk Labs for practical notes on software, design, SEO, and digital growth.
            </p>
            <Button asChild size="lg" variant="secondary">
              <a href="/contact">Talk With Us</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

