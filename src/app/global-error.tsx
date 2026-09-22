"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/kit/error-state";
import "./globals.css";

/** Last resort for errors in the root layout itself; replaces it, so it brings its own <html> and <body>. */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="tr">
      <body className="flex min-h-dvh items-center justify-center bg-canvas p-6">
        <ErrorState title="Uygulama yüklenemedi" description="Sayfayı yenileyerek tekrar deneyin." onRetry={retry} />
      </body>
    </html>
  );
}
