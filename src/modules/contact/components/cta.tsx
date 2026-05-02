import type { CtaSection } from "../types";

export function CtaSection({ title, subtitle, buttonText, buttonLink }: CtaSection) {
  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="section-container text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">{title}</h2>
          <p className="text-lg opacity-90">{subtitle}</p>
          <a
            href={buttonLink}
            className="inline-block bg-background text-primary px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            {buttonText}
          </a>
        </div>
      </div>
    </section>
  );
}
