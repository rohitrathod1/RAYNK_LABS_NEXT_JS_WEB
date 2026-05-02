import type { MapSection } from "../types";

export function MapSection({ title, embedUrl }: MapSection) {
  if (!embedUrl) return null;

  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h2>
        </div>
        <div className="rounded-lg overflow-hidden border bg-muted aspect-video">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location Map"
          />
        </div>
      </div>
    </section>
  );
}
