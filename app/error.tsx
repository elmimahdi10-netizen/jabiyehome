// app/error.tsx — Global error boundary for unexpected runtime errors
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error tracking service in production
    if (process.env.NODE_ENV === "production") {
      console.error("[Global Error Boundary]", {
        message: error.message,
        digest: error.digest,
        timestamp: new Date().toISOString(),
      });
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="h-20 w-20 rounded-2xl flex items-center justify-center mx-auto"
          style={{ background: "color-mix(in srgb, var(--color-destructive) 12%, transparent)" }}>
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted-foreground)" }}>
            We&apos;ve been notified and are working on a fix. Please try again.
          </p>
          {error.digest && (
            <p className="text-xs mt-2 font-mono px-3 py-1.5 rounded-lg inline-block"
              style={{ background: "var(--color-muted)", color: "var(--color-muted-foreground)" }}>
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>
            <RefreshCw className="h-4 w-4" /> Try again
          </Button>
          <Button variant="outline" asChild>
            <a href="/"><Home className="h-4 w-4" /> Go home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
