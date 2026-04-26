"use client";

import { useRef, useState, useEffect } from "react";
import type React from "react";

export function LazyOnView({
  children,
  rootMargin = "200px",
}: {
  children: React.ReactNode;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className="min-h-[1px]">
      {visible ? children : null}
    </div>
  );
}
