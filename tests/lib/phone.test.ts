import { describe, expect, it } from "vitest";
import { isPhoneNumber, nationalNumber } from "@/lib/phone";

describe("isPhoneNumber", () => {
  it("treats an empty string as fine, since a phone is usually optional", () => {
    expect(isPhoneNumber("")).toBe(true);
  });

  it.each(["0532 123 45 67", "+90 (532) 123-45-67", "05321234567", "532 123 45 67"])("accepts %s", (phone) => {
    expect(isPhoneNumber(phone)).toBe(true);
  });

  it.each(["abc", "123", "0532 123 45 67 89 01 23", "05321234567890123"])("rejects %s", (phone) => {
    expect(isPhoneNumber(phone)).toBe(false);
  });
});

describe("nationalNumber", () => {
  it("is the last ten digits, so different ways of writing the same number match", () => {
    expect(nationalNumber("0532 123 45 67")).toBe(nationalNumber("+90 532 123 45 67"));
    expect(nationalNumber("0532 123 45 67")).toBe("5321234567");
  });

  it("is empty for an empty phone", () => {
    expect(nationalNumber("")).toBe("");
  });
});
