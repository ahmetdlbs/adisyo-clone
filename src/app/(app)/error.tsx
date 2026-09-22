"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/kit/error-state";
import { PageContainer } from "@/components/kit/page";

/** Catches render errors in any signed-in screen; the shell around it stays usable. */
export default function AppError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    // `digest` matches this error to the server-side log line.
    console.error(error);
  }, [error]);

  return (
    <PageContainer>
      <ErrorState onRetry={retry} />
    </PageContainer>
  );
}
