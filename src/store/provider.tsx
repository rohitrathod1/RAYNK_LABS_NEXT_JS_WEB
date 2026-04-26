"use client";

// Redux Provider — used inside the Providers composite in app/layout.tsx.
// Do NOT wrap individual modules or components with this.

import { Provider } from "react-redux";
import { store } from "@/store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
