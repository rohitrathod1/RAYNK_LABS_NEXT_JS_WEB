import { AboutSplitSkeleton } from "@/modules/about/components/shared/skeletons";

export default function AboutLoading() {
  return (
    <main>
      <section className="min-h-[calc(72svh-4rem)] bg-muted" aria-hidden="true" />
      <AboutSplitSkeleton />
    </main>
  );
}

