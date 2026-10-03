import { describe, expect, it } from "vitest";
import { formatClock, formatDate, formatTRY } from "@/lib/format";

describe("formatClock", () => {
  it("shows the time of day as HH:mm", () => {
    expect(formatClock("2026-09-21T20:03:00.000Z", "UTC")).toBe("20:03");
    expect(formatClock("2026-09-21T09:05:00.000Z", "UTC")).toBe("09:05");
  });

  it("uses the given time zone", () => {
    expect(formatClock("2026-09-21T20:03:00.000Z", "Europe/Istanbul")).toBe("23:03");
  });
});

describe("formatDate", () => {
  it("shows the date as DD.MM.YYYY", () => {
    expect(formatDate("2026-09-19T16:21:00.000Z", "UTC")).toBe("19.09.2026");
  });

  it("uses the given time zone", () => {
    expect(formatDate("2026-09-19T22:30:00.000Z", "Europe/Istanbul")).toBe("20.09.2026");
  });
});

describe("formatTRY", () => {
  it("formats whole amounts with two decimals and the lira sign", () => {
    expect(formatTRY(52)).toBe("₺52,00");
  });

  it("uses tr-TR thousands and decimal separators", () => {
    expect(formatTRY(1234.5)).toBe("₺1.234,50");
    expect(formatTRY(1234567.89)).toBe("₺1.234.567,89");
  });

  it("formats zero", () => {
    expect(formatTRY(0)).toBe("₺0,00");
  });

  it("formats negative amounts", () => {
    expect(formatTRY(-1234.5)).toBe("-₺1.234,50");
  });

  it("rounds to the kuruş", () => {
    expect(formatTRY(0.999)).toBe("₺1,00");
  });

  it.each([NaN, Infinity, -Infinity])("throws on non-finite amount %s", (amount) => {
    expect(() => formatTRY(amount)).toThrow(RangeError);
  });
});
