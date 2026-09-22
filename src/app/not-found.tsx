import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ROUTES } from "@/config/routes";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-canvas p-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileQuestion />
          </EmptyMedia>
          <EmptyTitle>Sayfa bulunamadı</EmptyTitle>
          <EmptyDescription>Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href={ROUTES.dashboard} className={buttonVariants()}>
            Ana sayfaya dön
          </Link>
        </EmptyContent>
      </Empty>
    </main>
  );
}
