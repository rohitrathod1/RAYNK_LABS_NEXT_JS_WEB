"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { LazyOnView } from "@/components/shared/lazy-on-view";
import { SectionSkeleton } from "@/components/common/section-skeleton";
import type { ContactPageData } from "../types";

const ContactExperience = dynamic(
  () => import("./contact-experience").then((module) => module.ContactExperience),
  { loading: () => <SectionSkeleton /> },
);

export function LazyContactSections({ data }: { data: ContactPageData }) {
  return (
    <LazyOnView fallback={<SectionSkeleton />} rootMargin="450px" minHeight={900}>
      <Suspense fallback={<SectionSkeleton />}>
        <ContactExperience data={data} />
      </Suspense>
    </LazyOnView>
  );
}

