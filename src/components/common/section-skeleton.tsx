export function SectionSkeleton() {
  return (
    <div className="w-full py-20 px-4 animate-pulse">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="h-8 bg-muted rounded-lg w-1/3 mx-auto" />
        <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
