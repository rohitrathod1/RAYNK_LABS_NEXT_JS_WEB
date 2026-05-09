import { Compass } from "lucide-react";
import { SystemState, defaultHomeAction } from "@/components/shared/system-state";

export default function NotFound() {
  return (
    <SystemState
      eyebrow="Page Not Found"
      code="404"
      title="This page drifted out of range"
      description="The link may be broken, moved, or no longer available. You can go back to where you were or return home."
      icon={Compass}
      primaryAction={defaultHomeAction()}
    />
  );
}
