export const DEFAULT_PAGE_SIZE = 10;

function assertPageSize(pageSize: number) {
  if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new RangeError(`pageSize must be a whole number of at least 1, received ${pageSize}`);
  }
}

/** Number of pages for `total` items. An empty list still has one (empty) page, so "1 / 1" never reads "1 / 0". */
export function pageCount(total: number, pageSize: number): number {
  assertPageSize(pageSize);
  return Math.max(1, Math.ceil(total / pageSize));
}

/** Pulls a requested page into 1..pageCount, e.g. after the list got shorter. */
export function clampPage(page: number, total: number, pageSize: number): number {
  return Math.min(Math.max(1, page), pageCount(total, pageSize));
}

/** The items on a 1-based page. A page past the end shows the last one rather than nothing. */
export function paginate<T>(items: readonly T[], page: number, pageSize: number = DEFAULT_PAGE_SIZE): readonly T[] {
  const current = clampPage(page, items.length, pageSize);
  return items.slice((current - 1) * pageSize, current * pageSize);
}
