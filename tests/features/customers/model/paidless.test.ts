import { describe, expect, it } from "vitest";
import { formatPaidlessNo, paidlessFormSchema, paidlessSearchText, type Paidless } from "@/features/customers/model/paidless";

const MEHMET: Paidless = { id: "p1", no: 10000000, firstName: "Mehmet", lastName: "Öz", title: "Müdür" };
const values = { firstName: "Zeynep", lastName: "Aksoy", title: "" };

describe("paidlessFormSchema", () => {
  it("needs a first name, and trims it", () => {
    expect(paidlessFormSchema.safeParse({ ...values, firstName: " " }).error?.issues[0]?.message).toBe("Ad zorunludur");
    expect(paidlessFormSchema.parse({ ...values, firstName: " Zeynep " }).firstName).toBe("Zeynep");
  });

  it("does not need a last name or a title", () => {
    expect(paidlessFormSchema.safeParse({ firstName: "Zeynep", lastName: "", title: "" }).success).toBe(true);
  });

  it("limits how long each part can be", () => {
    expect(paidlessFormSchema.safeParse({ ...values, firstName: "a".repeat(41) }).success).toBe(false);
    expect(paidlessFormSchema.safeParse({ ...values, title: "a".repeat(41) }).success).toBe(false);
  });
});

describe("formatPaidlessNo", () => {
  it("writes the number the way the list shows it", () => {
    expect(formatPaidlessNo(10000042)).toBe("#10000042");
  });
});

describe("paidlessSearchText", () => {
  it("covers the name and the number", () => {
    expect(paidlessSearchText(MEHMET)).toContain("Mehmet Öz");
    expect(paidlessSearchText(MEHMET)).toContain("#10000000");
  });
});
