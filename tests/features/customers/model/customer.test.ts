import { describe, expect, it } from "vitest";
import { customerFormSchema, totalBalance, customerSearchText, type Customer } from "@/features/customers/model/customer";

const ALI: Customer = { id: "c1", no: 1, firstName: "Ali", lastName: "Yılmaz", phone: "0532 123 45 67", phone2: "", balance: 15050 };
const AYSE: Customer = { id: "c2", no: 2, firstName: "Ayşe", lastName: "", phone: "", phone2: "0212 555 00 11", balance: 0 };

const form = (overrides: Partial<Record<keyof typeof base, string>> = {}) => ({ ...base, ...overrides });
const base = { firstName: "Veli", lastName: "Demir", phone: "0533 999 88 77", phone2: "", balance: "0" };

describe("customerFormSchema", () => {
  it("turns a filled-in form into a customer's values, with the balance in kuruş", () => {
    const result = customerFormSchema.parse(form({ balance: "150,5" }));

    expect(result).toEqual({ firstName: "Veli", lastName: "Demir", phone: "0533 999 88 77", phone2: "", balance: 15050 });
  });

  it("needs a first name, and trims it", () => {
    expect(customerFormSchema.safeParse(form({ firstName: "   " })).error?.issues[0]?.message).toBe("Ad zorunludur");
    expect(customerFormSchema.parse(form({ firstName: "  Veli " })).firstName).toBe("Veli");
  });

  it("does not need a last name or any phone", () => {
    expect(customerFormSchema.safeParse(form({ lastName: "", phone: "", phone2: "" })).success).toBe(true);
  });

  it.each(["0532 123 45 67", "+90 (532) 123-45-67", "05321234567"])("accepts the phone number %s", (phone) => {
    expect(customerFormSchema.safeParse(form({ phone })).success).toBe(true);
  });

  it.each(["abc", "123", "0532 123 45 67 89 01 23"])("rejects the phone number %s", (phone) => {
    expect(customerFormSchema.safeParse(form({ phone })).error?.issues[0]?.message).toBe("Geçerli bir telefon numarası giriniz");
  });

  it("reads an empty balance as zero and rejects text", () => {
    expect(customerFormSchema.parse(form({ balance: "" })).balance).toBe(0);
    expect(customerFormSchema.safeParse(form({ balance: "abc" })).error?.issues[0]?.message).toBe("Geçerli bir bakiye giriniz");
  });

  it("limits how long a name can be", () => {
    expect(customerFormSchema.safeParse(form({ firstName: "a".repeat(41) })).success).toBe(false);
    expect(customerFormSchema.safeParse(form({ lastName: "a".repeat(41) })).success).toBe(false);
  });
});

describe("totalBalance", () => {
  it("adds up what customers owe", () => {
    expect(totalBalance([ALI, AYSE, { ...ALI, id: "c3", balance: 4950 }])).toBe(20000);
    expect(totalBalance([])).toBe(0);
  });
});

describe("customerSearchText", () => {
  it("covers the name and both phone numbers", () => {
    expect(customerSearchText(ALI)).toContain("Ali Yılmaz");
    expect(customerSearchText(ALI)).toContain("0532 123 45 67");
    expect(customerSearchText(AYSE)).toContain("0212 555 00 11");
  });
});
