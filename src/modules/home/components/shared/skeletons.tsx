import { Skeleton } from "@/components/ui/skeleton";

export function HomeGridSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <section className="section-padding bg-background" aria-hidden="true">
      <div className="section-container space-y-10">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <Skeleton className="mx-auto h-10 w-3/4" />
          <Skeleton className="mx-auto h-5 w-2/3" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: cards }).map((_, index) => (
            <div key={index} className="rounded-xl border border-border bg-card p-6">
              <Skeleton className="mb-5 h-12 w-12 rounded-lg" />
              <Skeleton className="mb-3 h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeSplitSkeleton() {
  return (
    <section className="section-padding bg-background" aria-hidden="true">
      <div className="section-container grid grid-cols-1 gap-12 lg:grid-cols-2">
        <Skeleton className="min-h-[320px] rounded-2xl" />
        <div className="space-y-5 self-center">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-5 w-4/5" />
        </div>
      </div>
    </section>
  );
}

