export default function RootLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="min-h-[90vh] w-full animate-pulse bg-muted/20" />
      <div className="py-20 space-y-6 max-w-6xl mx-auto px-4 w-full">
        <div className="h-8 bg-muted rounded-lg w-1/3 mx-auto" />
        <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
