"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { LazyOnView } from "@/components/shared/lazy-on-view";
import type { ContactPageData } from "../types";
import { ContactExperienceSkeleton } from "./contact-experience";

const ContactExperience = dynamic(
  () => import("./contact-experience").then((module) => module.ContactExperience),
  { loading: () => <ContactExperienceSkeleton /> },
);

export function LazyContactSections({ data }: { data: ContactPageData }) {
  return (
    <LazyOnView fallback={<ContactExperienceSkeleton />} rootMargin="450px" minHeight={1200}>
      <Suspense fallback={<ContactExperienceSkeleton />}>
        <ContactExperience data={data} />
      </Suspense>
    </LazyOnView>
  );
}
