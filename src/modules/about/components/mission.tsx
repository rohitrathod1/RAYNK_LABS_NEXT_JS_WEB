import { dynamicIcon } from "@/lib/icon-map";

export function MissionSection({ data }: { data: { title: string; subtitle: string; items: Array<{ title: string; description: string; icon: string }> } }) {
  return (
    <section className="section-padding bg-muted/30">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{data.title}</h2>
          {data.subtitle && <p className="text-lg text-muted-foreground">{data.subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.items.map((item, i) => {
            const Icon = dynamicIcon(item.icon);
            return (
              <div key={i} className="bg-background rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                {Icon && <Icon className="w-12 h-12 mx-auto mb-4 text-primary" />}
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
