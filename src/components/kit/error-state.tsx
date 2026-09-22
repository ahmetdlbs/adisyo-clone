import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface ErrorStateProps {
  title?: string;
  description?: string;
  /** Shows a "Tekrar dene" button when given. */
  onRetry?: () => void;
}

/** What an error boundary renders: says what happened in plain Turkish and offers a retry. */
export function ErrorState({
  title = "Bir şeyler ters gitti",
  description = "Beklenmedik bir hata oluştu. Tekrar deneyebilirsiniz.",
  onRetry,
}: ErrorStateProps) {
  return (
    <Empty role="alert">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TriangleAlert />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {onRetry && (
        <EmptyContent>
          <Button onClick={onRetry}>Tekrar dene</Button>
        </EmptyContent>
      )}
    </Empty>
  );
}
