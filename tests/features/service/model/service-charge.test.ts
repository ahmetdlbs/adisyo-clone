import { describe, expect, it } from "vitest";
import {
  createServiceChargeFormSchema,
  serviceChargeAmount,
} from "@/features/service/model/service-charge";

describe("createServiceChargeFormSchema", () => {
  it("needs a name", () => {
    expect(createServiceChargeFormSchema("amount").safeParse({ name: " ", amount: "10" }).error?.issues[0]?.message).toBe(
      "Ad zorunludur"
    );
  });

  it("reads an amount charge in kuruş", () => {
    expect(createServiceChargeFormSchema("amount").parse({ name: "Kuver", amount: "12,5" })).toEqual({
      name: "Kuver",
      amount: 1250,
      kind: "amount",
    });
  });

  it("reads a percent charge as a whole number 1-100", () => {
    expect(createServiceChargeFormSchema("percent").parse({ name: "Garsoniye", amount: "10" })).toEqual({
      name: "Garsoniye",
      amount: 10,
      kind: "percent",
    });
    expect(createServiceChargeFormSchema("percent").safeParse({ name: "Garsoniye", amount: "150" }).success).toBe(false);
    expect(createServiceChargeFormSchema("percent").safeParse({ name: "Garsoniye", amount: "0" }).success).toBe(false);
  });

  it("rejects an amount that is not a valid figure", () => {
    expect(createServiceChargeFormSchema("amount").safeParse({ name: "Kuver", amount: "abc" }).error?.issues[0]?.message).toBe(
      "Geçerli bir tutar giriniz"
    );
  });

  it("reports a missing name and an invalid amount together", () => {
    const result = createServiceChargeFormSchema("amount").safeParse({ name: "", amount: "abc" });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path[0]).sort()).toEqual(["amount", "name"]);
  });
});

describe("serviceChargeAmount", () => {
  it("is the fixed amount for an amount-kind charge, whatever the subtotal", () => {
    expect(serviceChargeAmount({ name: "Kuver", kind: "amount", amount: 1500, autoAdd: true }, 100000)).toBe(1500);
  });

  it("is that percent of the subtotal for a percent-kind charge, rounded", () => {
    expect(serviceChargeAmount({ name: "Garsoniye", kind: "percent", amount: 10, autoAdd: true }, 10001)).toBe(1000);
  });
});
