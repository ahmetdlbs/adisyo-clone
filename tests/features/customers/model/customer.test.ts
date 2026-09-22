import { describe, expect, it } from "vitest";
import { customerFormSchema, saveCustomer, totalBalance, customerSearchText, type Customer } from "@/features/customers/model/customer";

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

describe("saveCustomer", () => {
  const values = { firstName: "Veli", lastName: "Demir", phone: "0533 999 88 77", phone2: "", balance: 2500 };

  it("adds a customer with the next number", () => {
    const first = saveCustomer([], { id: null, ...values }, () => "new-1");
    const second = saveCustomer([ALI, AYSE], { id: null, ...values }, () => "new-2");

    expect(first).toEqual([{ id: "new-1", no: 1, ...values }]);
    expect(second.at(-1)).toMatchObject({ id: "new-2", no: 3, firstName: "Veli" });
  });

  it("numbers after the highest number in use, so a deleted customer's number is not handed out twice", () => {
    const afterDelete = [{ ...ALI, no: 5 }];

    expect(saveCustomer(afterDelete, { id: null, ...values }, () => "n").at(-1)?.no).toBe(6);
  });

  it("changes a customer in place and keeps their number", () => {
    const result = saveCustomer([ALI, AYSE], { id: "c1", ...values, firstName: "Mehmet" }, () => "unused");

    expect(result.map((customer) => customer.id)).toEqual(["c1", "c2"]);
    expect(result[0]).toMatchObject({ no: 1, firstName: "Mehmet", balance: 2500 });
  });

  it("does not edit a customer that does not exist", () => {
    expect(() => saveCustomer([ALI], { id: "nope", ...values }, () => "n")).toThrow("Müşteri bulunamadı");
  });

  it("refuses a phone number that another customer already has, however it is written", () => {
    expect(() => saveCustomer([ALI], { id: null, ...values, phone: "05321234567" }, () => "n")).toThrow("Bu telefon numarası başka bir müşteride kayıtlı");
    expect(() => saveCustomer([AYSE], { id: null, ...values, phone: "+90 212 555 00 11" }, () => "n")).toThrow("Bu telefon numarası");
    expect(() => saveCustomer([AYSE], { id: null, ...values, phone: "(0212) 555-0011" }, () => "n")).toThrow("Bu telefon numarası");
    expect(() => saveCustomer([AYSE], { id: null, ...values, phone: "0212 555 00 12" }, () => "n")).not.toThrow();
  });

  it("lets a customer keep their own phone number when edited", () => {
    expect(() => saveCustomer([ALI], { id: "c1", ...values, phone: "0532 123 45 67" }, () => "n")).not.toThrow();
  });

  it("never counts an empty phone as taken", () => {
    expect(() => saveCustomer([AYSE], { id: null, ...values, phone: "", phone2: "" }, () => "n")).not.toThrow();
  });

  it("does not modify the list it is given", () => {
    const list = [ALI];

    saveCustomer(list, { id: null, ...values }, () => "n");

    expect(list).toEqual([ALI]);
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
