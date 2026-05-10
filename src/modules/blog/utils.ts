import type { BlogPostItem } from "./types";

export function getBlogDate(post: BlogPostItem) {
  return post.publishedAt ?? post.createdAt;
}

export function formatBlogDate(post: BlogPostItem) {
  return new Date(getBlogDate(post)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function estimateReadingTime(content: string) {
  const text = content.replace(/<[^>]*>/g, " ").trim();
  const words = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 220));
}

export function getPrimaryTag(post: BlogPostItem) {
  return post.tags[0] ?? "Technology";
}

