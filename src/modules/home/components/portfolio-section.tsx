"use client";

import Image from "next/image";
import Link from "next/link";
import type { PortfolioSection } from "../types";
import { HOME_IMAGE_SIZES } from "../constants";
import { resolveHomeImageSrc } from "./shared/image-url";
import { Reveal } from "./shared/reveal";
import { HomeSectionHeading } from "./shared/section-heading";

export function PortfolioSection({ data }: { data: PortfolioSection }) {
  return (
    <section className="section-padding bg-muted/30">
      <div className="section-container">
        <div className="space-y-12">
          <Reveal>
            <HomeSectionHeading title={data.title} subtitle={data.subtitle} />
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((item, index) => (
              <Reveal key={`${item.title}-${index}`} delay={index * 0.04}>
                <Link href={item.href} className="block">
                  <article className="group relative overflow-hidden rounded-xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                    <Image
                      src={resolveHomeImageSrc(item.image)}
                      alt={item.title}
                      fill
                      sizes={HOME_IMAGE_SIZES.third}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
