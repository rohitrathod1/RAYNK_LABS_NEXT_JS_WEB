"use client";

// Composite Providers — wraps all context providers in correct order.
// Used ONCE in src/app/layout.tsx. Never wrap at module level.
//
// Order: AuthSession → Redux → Query → Theme

import type React from "react";
import { AuthSessionProvider } from "./session-provider";
import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import { ReduxProvider } from "@/store/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionProvider>
      <ReduxProvider>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </QueryProvider>
      </ReduxProvider>
    </AuthSessionProvider>
  );
}

export { QueryProvider } from "./query-provider";
export { ThemeProvider } from "./theme-provider";
export { AuthSessionProvider } from "./session-provider";
