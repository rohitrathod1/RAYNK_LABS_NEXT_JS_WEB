import type { HeroSection } from "../types";
import { HomeHeroCarousel } from "./Hero/hero-carousel";

export function HeroSection({ data }: { data: HeroSection }) {
  const slides = data.slides?.length
    ? data.slides
    : [
        {
          heading: data.heading,
          subtitle: data.subtitle,
          backgroundImage: data.backgroundImage,
          ctaPrimaryText: data.ctaPrimaryText,
          ctaPrimaryHref: data.ctaPrimaryHref,
          ctaSecondaryText: data.ctaSecondaryText,
          ctaSecondaryHref: data.ctaSecondaryHref,
        },
      ];

  return (
    <section
      id="section1-home-hero"
      className="relative min-h-[calc(100svh-4rem)] overflow-hidden bg-background"
      aria-label="RaYnk Labs hero"
    >
      <span id="hero" className="block scroll-mt-24" aria-hidden="true" />
      <HomeHeroCarousel slides={slides} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
