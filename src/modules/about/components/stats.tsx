"use client";

import { useEffect, useRef, useState } from "react";
import type { AboutPageData } from "../types";
import { Reveal } from "./shared/reveal";

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const duration = 900;
        const start = performance.now();

        function tick(now: number) {
          const progress = Math.min((now - start) / duration, 1);
          setDisplayValue(Math.round(value * progress));
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { rootMargin: "120px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{displayValue}</span>;
}

export function StatsSection({ data }: { data: AboutPageData }) {
  const stats = [
    {
      label: "Projects Delivered",
      value: Math.max(50, data.why_choose_us.points.length * 8),
      suffix: "+",
    },
    {
      label: "Core Capabilities",
      value: data.mission.items.length + data.why_choose_us.points.length,
      suffix: "+",
    },
    {
      label: "Team Members",
      value: Math.max(data.core_team.members.length, 4),
      suffix: "+",
    },
    {
      label: "Growth Focus",
      value: 100,
      suffix: "%",
    },
  ];

  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="section-container">
        <Reveal className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-6 text-center backdrop-blur transition hover:-translate-y-1 hover:bg-primary-foreground/15"
            >
              <p className="text-4xl font-black tracking-tight text-primary-foreground sm:text-5xl">
                <AnimatedNumber value={stat.value} />
                {stat.suffix}
              </p>
              <p className="mt-3 text-sm font-medium text-primary-foreground/75">
                {stat.label}
              </p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

