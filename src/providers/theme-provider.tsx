"use client";

// Lightweight class-based theme provider without client-rendered script tags.

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: ReactNode;
  attribute?: "class";
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  setTheme: () => {},
});

function getSystemTheme() {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme, enableSystem: boolean) {
  const resolvedTheme = theme === "system" && enableSystem ? getSystemTheme() : theme;
  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  enableSystem = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const stored = window.localStorage.getItem("theme") as Theme | null;
      const initial = stored ?? defaultTheme;
      setThemeState(initial);
      applyTheme(initial, enableSystem);
    }, 0);
    return () => window.clearTimeout(id);
  }, [defaultTheme, enableSystem]);

  useEffect(() => {
    if (!enableSystem || theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("system", true);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [enableSystem, theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: (nextTheme) => {
        window.localStorage.setItem("theme", nextTheme);
        setThemeState(nextTheme);
        applyTheme(nextTheme, enableSystem);
      },
    }),
    [enableSystem, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
