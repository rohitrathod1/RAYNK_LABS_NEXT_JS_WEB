import Image from "next/image";
import { resolveImageSrc } from "@/lib/image-url";
import type { ServiceHero } from "../types";

export function ServiceHero({ title, subtitle, backgroundImage }: ServiceHero) {
  const imageSrc = resolveImageSrc(backgroundImage);

  return (
    <section id="section1-services-hero" className="relative h-[50vh] min-h-[400px] scroll-mt-24 flex items-center justify-center overflow-hidden">
      <Image
        src={imageSrc}
        alt={title}
        fill
        className="object-cover"
        priority
        loading="eager"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        {subtitle && <p className="text-xl md:text-2xl max-w-2xl mx-auto">{subtitle}</p>}
      </div>
    </section>
  );
}
