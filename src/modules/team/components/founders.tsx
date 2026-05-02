import { SafeImage } from "@/components/common/safe-image";
import { Users } from "lucide-react";

export function FoundersSection({ data }: { data: { title: string; subtitle: string; founders: Array<{ name: string; role: string; image: string; bio: string; portfolioUrl?: string }> } }) {
  return (
    <section className="section-padding bg-muted/30">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{data.title}</h2>
          <p className="text-lg text-muted-foreground">{data.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {data.founders.map((founder, index) => (
            <div key={index} className="bg-background rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-80">
                <SafeImage
                  src={founder.image}
                  alt={founder.name}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6 space-y-3">
                <h3 className="text-2xl font-semibold">{founder.name}</h3>
                <p className="text-primary font-medium">{founder.role}</p>
                <p className="text-muted-foreground">{founder.bio}</p>
                {founder.portfolioUrl && (
                  <a
                    href={founder.portfolioUrl}
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <Users className="w-4 h-4" />
                    View Portfolio
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
