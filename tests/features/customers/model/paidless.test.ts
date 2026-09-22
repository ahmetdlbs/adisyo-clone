import { describe, expect, it } from "vitest";
import { formatPaidlessNo, paidlessFormSchema, paidlessSearchText, savePaidless, type Paidless } from "@/features/customers/model/paidless";

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

describe("savePaidless", () => {
  it("numbers the first person 10000000 and each next one after the highest in use", () => {
    const first = savePaidless([], { id: null, ...values }, () => "a");
    const second = savePaidless(first, { id: null, firstName: "Can", lastName: "", title: "" }, () => "b");

    expect(first[0]?.no).toBe(10000000);
    expect(second[1]?.no).toBe(10000001);
  });

  it("edits in place and keeps the number", () => {
    const result = savePaidless([MEHMET], { id: "p1", ...values }, () => "unused");

    expect(result).toEqual([{ id: "p1", no: 10000000, ...values }]);
  });

  it("does not edit someone who is not in the list", () => {
    expect(() => savePaidless([MEHMET], { id: "nope", ...values }, () => "n")).toThrow("Kayıt bulunamadı");
  });

  it("refuses the same full name twice, with Turkish case rules", () => {
    expect(() => savePaidless([MEHMET], { id: null, firstName: "MEHMET", lastName: "ÖZ", title: "" }, () => "n")).toThrow("Bu kişi zaten kayıtlı");
    expect(() => savePaidless([{ ...MEHMET, firstName: "İlker", lastName: "" }], { id: null, firstName: "ilker", lastName: "", title: "" }, () => "n")).toThrow("Bu kişi zaten kayıtlı");
  });

  it("lets a person keep their own name when edited", () => {
    expect(() => savePaidless([MEHMET], { id: "p1", firstName: "Mehmet", lastName: "Öz", title: "Sahip" }, () => "n")).not.toThrow();
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
