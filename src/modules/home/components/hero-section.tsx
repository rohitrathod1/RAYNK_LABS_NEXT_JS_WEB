import Link from "next/link";
import { SafeImage } from "@/components/common/safe-image";
import type { HeroSection as HeroSectionType } from "../types";

export function HeroSection({ data }: { data: HeroSectionType }) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
      {data.backgroundImage && (
        <SafeImage
          src={data.backgroundImage}
          alt="Hero background"
          fill
          priority
          className="object-cover opacity-10 dark:opacity-5"
        />
      )}

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {data.badgeText && (
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {data.badgeText}
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-3xl leading-tight">
          {data.heading}
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          {data.subheading}
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href={data.ctaHref}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            {data.ctaText}
          </Link>
          {data.secondaryCtaText && data.secondaryCtaHref && (
            <Link
              href={data.secondaryCtaHref}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-accent transition-colors"
            >
              {data.secondaryCtaText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
