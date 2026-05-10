"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { HOME_SECTION_ROOT_MARGIN } from "../../constants";

interface LazyHomeSectionProps {
  id?: string;
  aliases?: string[];
  children: ReactNode;
  fallback: ReactNode;
  minHeight?: number;
}

export function LazyHomeSection({
  id,
  aliases = [],
  children,
  fallback,
  minHeight = 360,
}: LazyHomeSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: HOME_SECTION_ROOT_MARGIN },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      id={id}
      ref={ref}
      style={{ minHeight: visible ? undefined : minHeight, scrollMarginTop: "96px" }}
    >
      {aliases.map((alias) => (
        <span key={alias} id={alias} className="block scroll-mt-24" aria-hidden="true" />
      ))}
      {visible ? children : fallback}
    </div>
  );
}
