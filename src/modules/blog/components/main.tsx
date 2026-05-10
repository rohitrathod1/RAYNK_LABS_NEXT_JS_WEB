import { BlogHero } from "./blog-hero";
import { LazyBlogSections } from "./lazy-blog-sections";
import type { BlogPageData, BlogPostItem } from "../types";

interface BlogContentProps {
  data: BlogPageData;
  posts: BlogPostItem[];
}

export function BlogContent({ data, posts }: BlogContentProps) {
  return (
    <main className="flex flex-col">
      <BlogHero data={data.hero} postCount={posts.length} />
      <LazyBlogSections data={data.blog_list} posts={posts} />
    </main>
  );
}
