import { SafeImage } from "@/components/common/safe-image";

export function HeroSection({ data }: { data: { title: string; subtitle: string; backgroundImage: string } }) {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <SafeImage
          src={data.backgroundImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div className="relative z-10 section-container section-padding text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
            {data.title}
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
