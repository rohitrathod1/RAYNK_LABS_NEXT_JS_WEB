import dynamic from "next/dynamic";
import type { ServiceHero } from "../types";

const Image = dynamic(() => import("next/image"));

export function ServiceHero({ title, subtitle, backgroundImage }: ServiceHero) {
  return (
    <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        {subtitle && <p className="text-xl md:text-2xl max-w-2xl mx-auto">{subtitle}</p>}
      </div>
    </section>
  );
}
