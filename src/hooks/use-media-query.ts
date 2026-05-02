"use client";

import { useEffect, useState } from "react";

// Tailwind v4 default breakpoints
const BREAKPOINTS = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const id = window.setTimeout(() => setMatches(mq.matches), 0);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => {
      window.clearTimeout(id);
      mq.removeEventListener("change", handler);
    };
  }, [query]);

  return matches;
}

export function useBreakpoint(bp: Breakpoint): boolean {
  return useMediaQuery(BREAKPOINTS[bp]);
}
