import { describe, expect, it } from "vitest";
import { formatKurus, parseLira, percentOf, splitEvenly, toAmountText, toKurus } from "@/lib/money";

describe("toKurus", () => {
  it("converts lira to whole kuruş", () => {
    expect(toKurus(52)).toBe(5200);
    expect(toKurus(12.5)).toBe(1250);
  });

  it("rounds away floating-point noise instead of truncating it", () => {
    expect(toKurus(0.1 + 0.2)).toBe(30);
    expect(toKurus(1.15)).toBe(115);
  });
});

describe("formatKurus", () => {
  it("formats as Turkish lira", () => {
    expect(formatKurus(123450)).toBe("₺1.234,50");
    expect(formatKurus(5)).toBe("₺0,05");
    expect(formatKurus(0)).toBe("₺0,00");
  });
});

describe("parseLira", () => {
  it.each([
    ["12", 1200],
    ["12,5", 1250],
    ["12.50", 1250],
    ["12,05", 1205],
    ["1.250,75", 125075],
    ["0", 0],
    [" 7 ", 700],
  ])("reads %j as %i kuruş", (input, expected) => {
    expect(parseLira(input)).toBe(expected);
  });

  it.each(["", "   ", "abc", "12,345", "12.345", "-5", "1,2,3", "12 tl"])("rejects %j", (input) => {
    expect(parseLira(input)).toBeNull();
  });
});

describe("splitEvenly", () => {
  it("gives every share the same amount when it divides evenly", () => {
    expect(splitEvenly(9000, 3)).toEqual([3000, 3000, 3000]);
  });

  it("hands the leftover kuruş to the first shares so nothing is lost", () => {
    expect(splitEvenly(10000, 3)).toEqual([3334, 3333, 3333]);
    expect(splitEvenly(2, 3)).toEqual([1, 1, 0]);
  });

  it.each([
    [10000, 3],
    [9999, 7],
    [1, 2],
    [123457, 10],
  ])("always adds back up to the total (%i / %i)", (total, parts) => {
    const shares = splitEvenly(total, parts);

    expect(shares).toHaveLength(parts);
    expect(shares.reduce((sum, share) => sum + share, 0)).toBe(total);
    expect(Math.max(...shares) - Math.min(...shares)).toBeLessThanOrEqual(1);
  });

  it("works for a single person", () => {
    expect(splitEvenly(4200, 1)).toEqual([4200]);
  });

  it.each([0, -1, 1.5, Number.NaN])("rejects %s people", (parts) => {
    expect(() => splitEvenly(1000, parts)).toThrow(RangeError);
  });
});

describe("percentOf", () => {
  it("takes a percentage of an amount", () => {
    expect(percentOf(10000, 10)).toBe(1000);
    expect(percentOf(10000, 100)).toBe(10000);
    expect(percentOf(10000, 0)).toBe(0);
  });

  it("rounds half a kuruş up", () => {
    expect(percentOf(5, 50)).toBe(3);
    expect(percentOf(1999, 10)).toBe(200);
  });

  it("supports fractional percentages", () => {
    expect(percentOf(10000, 12.5)).toBe(1250);
  });
});

describe("toAmountText", () => {
  it.each([
    [10000, "100"],
    [3334, "33,34"],
    [3350, "33,5"],
    [5, "0,05"],
    [0, "0"],
  ])("writes %i kuruş as %j", (kurus, text) => {
    expect(toAmountText(kurus)).toBe(text);
  });
});
