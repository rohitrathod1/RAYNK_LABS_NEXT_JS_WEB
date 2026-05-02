import { SafeImage } from "@/components/common/safe-image";

export function StorySection({ data }: { data: { image: string; content: string } }) {
  const paragraphs = data.content.split("\n").filter((p) => p.trim() !== "");

  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
            <SafeImage
              src={data.image}
              alt="Our story"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
