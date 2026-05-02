import { Lightbulb, Users, Heart, TrendingUp, BookOpen } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Lightbulb,
  Users,
  Heart,
  TrendingUp,
  BookOpen,
};

export function ValuesSection({ data }: { data: { title: string; subtitle: string; points: Array<{ icon: string; title: string; description: string }> } }) {
  return (
    <section className="section-padding bg-muted/30">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{data.title}</h2>
          <p className="text-lg text-muted-foreground">{data.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.points.map((point, index) => {
            const IconComponent = iconMap[point.icon] || Lightbulb;
            return (
              <div key={index} className="bg-background rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
                <p className="text-muted-foreground">{point.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
