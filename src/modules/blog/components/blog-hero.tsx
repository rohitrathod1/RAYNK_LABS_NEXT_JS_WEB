import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resolveImageSrc } from "@/lib/image-url";
import { BLOG_SECTIONS } from "../constants";
import type { BlogHeroSection } from "../types";

export function BlogHero({ data, postCount }: { data: BlogHeroSection; postCount: number }) {
  const imageSrc = resolveImageSrc(data.backgroundImage);

  return (
    <section
      id={BLOG_SECTIONS.hero}
      className="relative flex min-h-[72vh] scroll-mt-24 items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          loading="eager"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-background" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="section-container section-padding relative z-10 text-center">
        <div className="mx-auto max-w-4xl space-y-7">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-xl backdrop-blur">
            <Newspaper className="h-4 w-4" aria-hidden="true" />
            {postCount} published insight{postCount === 1 ? "" : "s"}
          </div>
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-7xl">
            {data.title}
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
            {data.subtitle}
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="group">
              <Link href={`#${BLOG_SECTIONS.grid}`}>
                Read Latest
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white">
              <Link href={`#${BLOG_SECTIONS.newsletter}`}>Get Updates</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

