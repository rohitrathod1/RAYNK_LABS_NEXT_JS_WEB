"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { SystemState, defaultHomeAction, defaultRetryAction } from "./system-state";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.error("[ErrorBoundary]", error, info);
    }
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    const details =
      process.env.NODE_ENV === "development" ? (
        <details>
          <summary className="cursor-pointer font-semibold text-foreground">Error details</summary>
          <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap">
            {this.state.error.stack ?? this.state.error.message}
          </pre>
        </details>
      ) : null;

    return (
      <SystemState
        eyebrow="Something Went Wrong"
        title={this.props.fallbackTitle ?? "We hit an unexpected issue"}
        description={
          this.props.fallbackDescription ??
          "The page could not continue safely. Try again, or head back to a stable page."
        }
        icon={AlertTriangle}
        primaryAction={defaultRetryAction(this.reset)}
        secondaryAction={defaultHomeAction()}
        details={details}
      />
    );
  }
}
