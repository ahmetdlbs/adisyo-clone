import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TablePaginationProps {
  /** Current page, 1-based. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

/** "‹ 2 / 5 ›" under a table. Both buttons stay on screen (disabled at the ends) so the layout does not jump. */
export function TablePagination({ page, pageCount, onPageChange }: TablePaginationProps) {
  return (
    <nav aria-label="Sayfalama" className="flex items-center justify-end gap-2 border-t px-6 py-3 text-[13px] text-muted-foreground">
      <Button variant="ghost" size="icon-sm" aria-label="Önceki sayfa" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft />
      </Button>
      <span aria-current="page" className="tabular-nums">
        {page} / {pageCount}
      </span>
      <Button variant="ghost" size="icon-sm" aria-label="Sonraki sayfa" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
        <ChevronRight />
      </Button>
    </nav>
  );
}
