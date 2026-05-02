export function IntroSection({ data }: { data: { description: string } }) {
  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {data.description}
          </p>
        </div>
      </div>
    </section>
  );
}
