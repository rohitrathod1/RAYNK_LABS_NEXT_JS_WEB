import { dynamicIcon } from "@/lib/icon-map";

export function WhyChooseSection({ data }: { data: { title: string; subtitle: string; points: Array<{ icon: string; title: string; description: string }> } }) {
  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{data.title}</h2>
          {data.subtitle && <p className="text-lg text-muted-foreground">{data.subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.points.map((point, i) => {
            const Icon = dynamicIcon(point.icon);
            return (
              <div key={i} className="flex gap-4 p-6 rounded-2xl border bg-card hover:shadow-md transition-shadow">
                <div className="flex-shrink-0">
                  {Icon && <Icon className="w-8 h-8 text-primary" />}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{point.title}</h3>
                  <p className="text-sm text-muted-foreground">{point.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
