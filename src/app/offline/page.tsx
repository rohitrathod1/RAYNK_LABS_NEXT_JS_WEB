"use client";

import { useEffect, useState } from "react";
import { WifiOff, RotateCcw, Home } from "lucide-react";
import { SystemState } from "@/components/shared/system-state";

export default function OfflinePage() {
  const [online, setOnline] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    const id = window.setTimeout(sync, 0);
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  const retry = async () => {
    setChecking(true);
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    setOnline(navigator.onLine);
    setChecking(false);
  };

  return (
    <SystemState
      eyebrow={online ? "Connection Restored" : "You Are Offline"}
      title={online ? "Your connection is back" : "No internet connection"}
      description={
        online
          ? "You can safely continue browsing. If a page looked stale, retry it once."
          : "Check your network connection. This page will update automatically when your device comes back online."
      }
      icon={WifiOff}
      primaryAction={{
        label: checking ? "Checking..." : "Retry Connection",
        onClick: retry,
        icon: RotateCcw,
      }}
      secondaryAction={{ label: "Go Home", href: "/", icon: Home, variant: "outline" }}
    />
  );
}
