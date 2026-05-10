"use client";

import { AlertTriangle } from "lucide-react";
import {
  SystemState,
  defaultHomeAction,
  defaultRetryAction,
} from "@/components/shared/system-state";

export default function AboutError({ reset }: { error: Error; reset: () => void }) {
  return (
    <SystemState
      eyebrow="About Page"
      title="We could not load the About page"
      description="A temporary issue stopped this page from rendering. Retry the page or return home."
      icon={AlertTriangle}
      primaryAction={defaultRetryAction(reset)}
      secondaryAction={defaultHomeAction()}
    />
  );
}

