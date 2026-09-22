import { describe, expect, it } from "vitest";
import { clampPage, DEFAULT_PAGE_SIZE, pageCount, paginate } from "@/lib/pagination";

const numbers = (count: number) => Array.from({ length: count }, (_, index) => index + 1);

describe("pageCount", () => {
  it("is always at least one page, even for an empty list", () => {
    expect(pageCount(0, 10)).toBe(1);
  });

  it("rounds up so the last partial page still counts", () => {
    expect([pageCount(10, 10), pageCount(11, 10), pageCount(25, 10)]).toEqual([1, 2, 3]);
  });

  it("rejects a page size that cannot hold anything", () => {
    expect(() => pageCount(5, 0)).toThrow(RangeError);
    expect(() => pageCount(5, 2.5)).toThrow(RangeError);
  });
});

describe("clampPage", () => {
  it("keeps a page that exists", () => {
    expect(clampPage(2, 25, 10)).toBe(2);
  });

  it("pulls a page past the end back to the last one", () => {
    expect(clampPage(9, 25, 10)).toBe(3);
  });

  it("never goes below the first page", () => {
    expect(clampPage(0, 25, 10)).toBe(1);
    expect(clampPage(-4, 25, 10)).toBe(1);
  });

  it("lands on the first page when there is nothing to show", () => {
    expect(clampPage(3, 0, 10)).toBe(1);
  });
});

describe("paginate", () => {
  it("returns the slice for a page", () => {
    expect(paginate(numbers(25), 2, 10)).toEqual(numbers(20).slice(10));
  });

  it("returns the short last page as it is", () => {
    expect(paginate(numbers(25), 3, 10)).toEqual([21, 22, 23, 24, 25]);
  });

  it("falls back to the last page instead of returning nothing when the page is out of range", () => {
    expect(paginate(numbers(25), 7, 10)).toEqual([21, 22, 23, 24, 25]);
  });

  it("does not modify the list it is given", () => {
    const items = numbers(12);

    paginate(items, 2, 5);

    expect(items).toEqual(numbers(12));
  });

  it("uses ten rows per page unless told otherwise", () => {
    expect(DEFAULT_PAGE_SIZE).toBe(10);
    expect(paginate(numbers(30), 1)).toHaveLength(10);
  });
});
