import { dynamicIcon } from "@/lib/icon-map";

export function SocialLinksSection({ data }: { data: { title: string; subtitle: string; links: Array<{ platform: string; url: string; icon: string }> } }) {
  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{data.title}</h2>
          {data.subtitle && <p className="text-lg text-muted-foreground">{data.subtitle}</p>}
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {data.links.map((link, i) => {
            const Icon = dynamicIcon(link.icon);
            return (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-4 bg-muted rounded-2xl hover:bg-muted/80 hover:shadow-md transition-all"
              >
                {Icon && <Icon className="w-6 h-6 text-primary" />}
                <span className="font-medium">{link.platform}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
