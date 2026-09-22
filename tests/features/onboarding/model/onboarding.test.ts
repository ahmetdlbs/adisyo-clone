import { describe, expect, it } from "vitest";
import {
  BUSINESS_TYPES,
  createInitialOnboardingAnswers,
  KITCHEN_DELIVERY_OPTIONS,
  ONBOARDING_STEPS,
  PAYMENT_TIME_OPTIONS,
  PAYMENT_TYPES,
  RECEIPT_OPTIONS,
  toggleInList,
  WORK_TYPES,
  type OnboardingAnswers,
} from "@/features/onboarding/model/onboarding";

describe("createInitialOnboardingAnswers", () => {
  it("starts from the defaults a new restaurant most likely wants", () => {
    const answers = createInitialOnboardingAnswers();

    expect(answers).toEqual({
      workTypes: ["Masa Siparişi"],
      paymentTypes: ["Nakit", "Kredi Kartı"],
      kitchenDelivery: "Her İkisi",
      paymentTime: "Karışık",
      receiptGiven: "Opsiyonel",
      businessType: "Cafe",
      country: "Türkiye",
      city: "",
      dayStart: "06:00",
      dayEnd: "23:45",
    } satisfies OnboardingAnswers);
  });
});

describe("toggleInList", () => {
  it("adds a value that is not there yet", () => {
    expect(toggleInList(["Nakit"], "Kredi Kartı")).toEqual(["Nakit", "Kredi Kartı"]);
  });

  it("removes a value that is already there", () => {
    expect(toggleInList(["Nakit", "Kredi Kartı"], "Nakit")).toEqual(["Kredi Kartı"]);
  });

  it("does not modify the list it is given", () => {
    const list = ["Nakit"];

    toggleInList(list, "Kredi Kartı");

    expect(list).toEqual(["Nakit"]);
  });
});

describe("option lists", () => {
  it("are not empty and have no duplicates", () => {
    for (const list of [WORK_TYPES, PAYMENT_TYPES, KITCHEN_DELIVERY_OPTIONS, PAYMENT_TIME_OPTIONS, RECEIPT_OPTIONS, BUSINESS_TYPES]) {
      expect(list.length).toBeGreaterThan(0);
      expect(new Set(list.map((option) => (typeof option === "string" ? option : option.title))).size).toBe(list.length);
    }
  });

  it("has three steps, titled to match what each one asks", () => {
    expect(ONBOARDING_STEPS.map((step) => step.title)).toEqual(["Çalışma Ayarlarınız", "İşletme Bilgileriniz", "Harika! Her Şey Hazır"]);
  });
});
