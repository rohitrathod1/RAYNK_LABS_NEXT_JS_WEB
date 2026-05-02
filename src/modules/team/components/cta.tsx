export function CtaSection({ data }: { data: { title: string; subtitle: string; buttonText: string; buttonLink: string } }) {
  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="section-container text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">{data.title}</h2>
          <p className="text-lg opacity-90">{data.subtitle}</p>
          <a
            href={data.buttonLink}
            className="inline-block bg-background text-primary px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            {data.buttonText}
          </a>
        </div>
      </div>
    </section>
  );
}
