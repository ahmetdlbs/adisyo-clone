import { useState } from "react";
import { clampPage, DEFAULT_PAGE_SIZE, pageCount, paginate } from "@/lib/pagination";

/**
 * Pages a list. The requested page is kept as state but always read through `clampPage`, so a list that shrinks
 * under the current page (a delete, a narrower search) lands on the last page that exists, without an effect.
 * Call `reset` when the filter changes.
 */
export function usePagination<T>(items: readonly T[], pageSize: number = DEFAULT_PAGE_SIZE) {
  const [requestedPage, setRequestedPage] = useState(1);
  const page = clampPage(requestedPage, items.length, pageSize);

  return {
    page,
    pageCount: pageCount(items.length, pageSize),
    pageItems: paginate(items, page, pageSize),
    setPage: (next: number) => setRequestedPage(clampPage(next, items.length, pageSize)),
    reset: () => setRequestedPage(1),
  };
}
