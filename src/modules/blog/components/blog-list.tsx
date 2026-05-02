"use client";

import { motion } from "framer-motion";
import type { BlogListSection, BlogPostItem } from "../types";
import { BlogCard } from "./blog-card";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/animation-variants";

interface BlogListProps {
  data: BlogListSection;
  posts: BlogPostItem[];
}

export function BlogList({ data, posts }: BlogListProps) {
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

          {posts.length === 0 ? (
            <motion.div variants={fadeIn} className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No articles published yet. Check back soon!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <motion.div key={post.id} variants={staggerItem}>
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
