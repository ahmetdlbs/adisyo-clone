import { PageBody, PageCard, PageContainer } from "@/components/kit/page";
import { Skeleton } from "@/components/ui/skeleton";

const ROW_COUNT = 6;

/** Instant fallback while a signed-in screen streams in; mirrors the header + list layout most screens share. */
export default function AppLoading() {
  return (
    <PageContainer role="status" aria-label="Yükleniyor">
      <PageCard>
        <div className="flex items-start gap-4 p-6">
          <Skeleton className="size-14 shrink-0" />
          <div className="grid gap-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
        </div>
        <PageBody className="grid content-start gap-3">
          {Array.from({ length: ROW_COUNT }, (_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </PageBody>
      </PageCard>
    </PageContainer>
  );
}
