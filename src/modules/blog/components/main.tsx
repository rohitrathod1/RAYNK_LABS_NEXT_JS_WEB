import dynamic from "next/dynamic";
import { SectionSkeleton } from "@/components/common/section-skeleton";
import type { BlogPageData, BlogPostItem } from "../types";

const BlogList = dynamic(
  () => import("./blog-list").then((m) => m.BlogList),
  { loading: () => <SectionSkeleton /> },
);

interface BlogContentProps {
  data: BlogPageData;
  posts: BlogPostItem[];
}

export function BlogContent({ data, posts }: BlogContentProps) {
  return (
    <main className="flex flex-col">
      <BlogList data={data.blog_list} posts={posts} />
    </main>
  );
}
