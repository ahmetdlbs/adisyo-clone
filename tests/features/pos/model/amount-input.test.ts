import { describe, expect, it } from "vitest";
import { pressKey, typedAmount, type AmountKey } from "@/features/pos/model/amount-input";

describe("typedAmount", () => {
  it("reads what was typed as kuruş", () => {
    expect(typedAmount("12,5")).toBe(1250);
    expect(typedAmount("100")).toBe(10000);
  });

  it("understands an amount that ends with the comma still waiting for decimals", () => {
    expect(typedAmount("12,")).toBe(1200);
    expect(typedAmount("0,")).toBe(0);
  });

  it("is null while nothing has been typed", () => {
    expect(typedAmount("")).toBeNull();
  });
});

const type = (keys: readonly AmountKey[], start = "") => keys.reduce((text, key) => pressKey(text, key), start);

describe("pressKey", () => {
  it("builds a number from digits", () => {
    expect(type(["1", "2", "5"])).toBe("125");
  });

  it("drops a leading zero when the next digit arrives", () => {
    expect(type(["0", "5"])).toBe("5");
    expect(type(["0", "0", "7"])).toBe("7");
  });

  it("keeps a single zero as zero", () => {
    expect(type(["0", "0"])).toBe("0");
  });

  it("starts a decimal with a leading zero when the comma comes first", () => {
    expect(type([","])).toBe("0,");
  });

  it("accepts only one decimal comma", () => {
    expect(type(["1", ",", "5", ","])).toBe("1,5");
  });

  it("stops at two decimals, the size of a kuruş", () => {
    expect(type(["1", ",", "2", "5", "9"])).toBe("1,25");
  });

  it("removes the last character, and is harmless on an empty input", () => {
    expect(type(["backspace"], "12,5")).toBe("12,");
    expect(type(["backspace", "backspace"], "1")).toBe("");
  });

  it("does not grow without bound", () => {
    const long = type(Array<AmountKey>(20).fill("9"));

    expect(long.length).toBeLessThanOrEqual(9);
  });

  it("can still be edited with backspace after hitting the limit", () => {
    const full = type(Array<AmountKey>(20).fill("9"));

    expect(pressKey(full, "backspace").length).toBe(full.length - 1);
  });
});
