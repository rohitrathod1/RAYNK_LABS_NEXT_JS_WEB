"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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

        const duration = 1000;
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
    <section className="section-padding bg-background">
      <div className="section-container">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.1),transparent_28%),rgba(255,255,255,0.02)] p-6 shadow-[0_24px_80px_-44px_rgba(15,23,42,1)] backdrop-blur-xl sm:p-8 lg:p-10">
          <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.article
                key={stat.label}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 240, damping: 18 }}
                className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-background/40 p-6 backdrop-blur-xl"
              >
                <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_45%)]" />
                <div className="absolute inset-0 rounded-[1.75rem] p-px [background:linear-gradient(135deg,rgba(59,130,246,0.5),rgba(255,255,255,0.04),rgba(168,85,247,0.38))]">
                  <div className="h-full w-full rounded-[1.65rem] bg-transparent" />
                </div>
                <div className="relative">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/45">
                    0{index + 1}
                  </p>
                  <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-foreground sm:text-5xl">
                    <AnimatedNumber value={stat.value} />
                    {stat.suffix}
                  </p>
                  <p className="mt-3 text-sm font-medium text-muted-foreground">{stat.label}</p>
                </div>
              </motion.article>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
