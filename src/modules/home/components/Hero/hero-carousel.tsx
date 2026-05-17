"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HOME_IMAGE_SIZES } from "../../constants";
import type { HeroSlide } from "../../types";
import { resolveHomeImageSrc } from "../shared/image-url";

interface HomeHeroCarouselProps {
  slides: HeroSlide[];
}

export function HomeHeroCarousel({ slides }: HomeHeroCarouselProps) {
  const autoplay = useMemo(
    () => Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: false }),
    [],
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", duration: 32 },
    [autoplay],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="absolute inset-0">
      <div ref={emblaRef} className="h-full overflow-hidden" aria-roledescription="carousel">
        <div className="flex h-full touch-pan-y">
          {slides.map((slide, index) => (
            <article
              key={slide.id ?? `${slide.heading}-${index}`}
              className="relative h-full min-w-0 flex-[0_0_100%]"
              aria-label={`Hero slide ${index + 1} of ${slides.length}`}
            >
              <Image
                src={resolveHomeImageSrc(slide.backgroundImage)}
                alt=""
                fill
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                sizes={HOME_IMAGE_SIZES.hero}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/80" />
            </article>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4 text-center text-white">
        <div className="mx-auto max-w-5xl space-y-7">
          <p className="mx-auto w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/85 backdrop-blur">
            Digital Products. Software. Growth.
          </p>
          <div className="space-y-5">
            <h1 className="text-balance text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {slides[selectedIndex]?.heading}
            </h1>
            <p className="mx-auto max-w-3xl text-pretty text-base leading-7 text-white/82 sm:text-lg md:text-xl">
              {slides[selectedIndex]?.subtitle}
            </p>
          </div>
          <div className="pointer-events-auto flex flex-col items-center justify-center gap-3 sm:flex-row">
            {slides[selectedIndex]?.ctaPrimaryText ? (
              <Button asChild size="lg" className="h-12 rounded-full px-7">
                <Link href={slides[selectedIndex].ctaPrimaryHref ?? "/contact"}>
                  {slides[selectedIndex].ctaPrimaryText}
                </Link>
              </Button>
            ) : null}
            {slides[selectedIndex]?.ctaSecondaryText ? (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-white/35 bg-white/10 px-7 text-white backdrop-blur hover:bg-white/20 hover:text-white"
              >
                <Link href={slides[selectedIndex].ctaSecondaryHref ?? "/portfolio"}>
                  {slides[selectedIndex].ctaSecondaryText}
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-2 backdrop-blur-md" aria-label="Hero slide controls">
          {slides.map((slide, index) => (
            <button
              key={slide.id ?? index}
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
              className={cn(
                "h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                selectedIndex === index ? "w-8 bg-white" : "w-2.5 bg-white/45 hover:bg-white/70",
              )}
              aria-label={`Go to hero slide ${index + 1}`}
              aria-current={selectedIndex === index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
