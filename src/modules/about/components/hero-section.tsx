import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ABOUT_IMAGE_SIZES } from "../constants";
import type { HeroSection as HeroSectionData } from "../types";
import { resolveAboutImageSrc } from "./shared/image-url";

export function HeroSection({ data }: { data: HeroSectionData }) {
  return (
    <section id="section1-about-hero" className="relative min-h-[calc(72svh-4rem)] overflow-hidden bg-background">
      <span id="hero" className="block scroll-mt-24" aria-hidden="true" />
      <div className="absolute inset-0">
        <Image
          src={resolveAboutImageSrc(data.backgroundImage)}
          alt=""
          fill
          priority
          sizes={ABOUT_IMAGE_SIZES.hero}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/75 via-background/55 to-background" />
      </div>

      <div className="relative z-10 section-container flex min-h-[calc(72svh-4rem)] items-center py-20">
        <div className="max-w-4xl space-y-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5 backdrop-blur transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Home className="h-4 w-4" aria-hidden="true" />
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-4 w-4" />
              </li>
              <li className="font-medium text-foreground" aria-current="page">
                About
              </li>
            </ol>
          </nav>

          <div className="space-y-5">
            <p className="w-fit rounded-full border border-border bg-background/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary backdrop-blur">
              About RaYnk Labs
            </p>
            <h1 className="text-balance text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            {data.title}
          </h1>
            <p className="max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg md:text-xl">
            {data.subtitle}
          </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full px-7">
              <Link href="/contact">Start a Project</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-7">
              <Link href="/team">Meet the Team</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
