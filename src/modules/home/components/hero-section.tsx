import { SafeImage } from "@/components/common/safe-image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { HeroSection } from "../types";

export function HeroSection({ data }: { data: HeroSection }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            {data.heading}
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="text-base px-8 py-6">
              <Link href={data.ctaPrimaryHref}>{data.ctaPrimaryText}</Link>
            </Button>
            {data.ctaSecondaryText && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base px-8 py-6 bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                <Link href={data.ctaSecondaryHref}>{data.ctaSecondaryText}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
