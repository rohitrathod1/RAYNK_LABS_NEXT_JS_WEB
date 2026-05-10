"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ABOUT_SECTION_ROOT_MARGIN } from "../../constants";

export function LazyAboutSection({
  id,
  aliases = [],
  children,
  fallback,
  minHeight = 360,
}: {
  id?: string;
  aliases?: string[];
  children: ReactNode;
  fallback: ReactNode;
  minHeight?: number;
}) {
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
      { rootMargin: ABOUT_SECTION_ROOT_MARGIN },
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
