'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { SystemState, defaultHomeAction, defaultRetryAction } from '@/components/shared/system-state';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <SystemState
      eyebrow="Something Went Wrong"
      title="We could not finish loading this page"
      description="A temporary issue stopped the page from rendering safely. Retry the page or return home."
      icon={AlertTriangle}
      primaryAction={defaultRetryAction(reset)}
      secondaryAction={defaultHomeAction()}
      details={
        process.env.NODE_ENV === 'development' ? (
          <details>
            <summary className="cursor-pointer font-semibold text-foreground">Error details</summary>
            <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap">
              {error.stack ?? error.message}
            </pre>
          </details>
        ) : null
      }
    />
  );
}
