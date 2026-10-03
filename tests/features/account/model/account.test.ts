import { describe, expect, it } from "vitest";
import { paymentStatusLabel, summarizeEntitlements, type AccountEntitlement } from "@/features/account/model/account";

describe("summarizeEntitlements", () => {
  it("is zero and null when nothing is entitled", () => {
    expect(summarizeEntitlements([])).toEqual({ activeCount: 0, nearestExpiry: null });
  });

  it("counts only the active entitlements", () => {
    const entitlements: AccountEntitlement[] = [
      { status: "ACTIVE", expiresAt: "2026-10-01T00:00:00.000Z" },
      { status: "CANCELLED", expiresAt: "2026-10-01T00:00:00.000Z" },
      { status: "EXPIRED", expiresAt: "2026-09-01T00:00:00.000Z" },
    ];

    expect(summarizeEntitlements(entitlements).activeCount).toBe(1);
  });

  it("picks the soonest expiry among the active ones", () => {
    const entitlements: AccountEntitlement[] = [
      { status: "ACTIVE", expiresAt: "2026-12-01T00:00:00.000Z" },
      { status: "ACTIVE", expiresAt: "2026-10-01T00:00:00.000Z" },
    ];

    expect(summarizeEntitlements(entitlements).nearestExpiry).toBe("2026-10-01T00:00:00.000Z");
  });

  it("is null when the only active entitlement never expires", () => {
    const entitlements: AccountEntitlement[] = [{ status: "ACTIVE", expiresAt: null }];

    expect(summarizeEntitlements(entitlements).nearestExpiry).toBeNull();
  });
});

describe("paymentStatusLabel", () => {
  it("labels every status in Turkish", () => {
    expect(paymentStatusLabel("PAID")).toBe("Ödendi");
    expect(paymentStatusLabel("PENDING")).toBe("Beklemede");
    expect(paymentStatusLabel("FAILED")).toBe("Başarısız");
  });
});
