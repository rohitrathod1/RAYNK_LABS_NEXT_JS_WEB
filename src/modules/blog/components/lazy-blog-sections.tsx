"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { LazyOnView } from "@/components/shared/lazy-on-view";
import { SectionSkeleton } from "@/components/common/section-skeleton";
import type { BlogListSection, BlogPostItem } from "../types";

const BlogExperience = dynamic(
  () => import("./blog-experience").then((module) => module.BlogExperience),
  { loading: () => <SectionSkeleton /> },
);

export function LazyBlogSections({ data, posts }: { data: BlogListSection; posts: BlogPostItem[] }) {
  return (
    <LazyOnView fallback={<SectionSkeleton />} rootMargin="450px" minHeight={760}>
      <Suspense fallback={<SectionSkeleton />}>
        <BlogExperience data={data} posts={posts} />
      </Suspense>
    </LazyOnView>
  );
}

