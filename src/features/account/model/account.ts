export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

/** One row from `GET /billing/payments` — see api/src/billing/billing.service.ts getPayments. */
export interface AccountPayment {
  id: string;
  amount: number;
  currency: string;
  provider: string;
  status: PaymentStatus;
  createdAt: string;
}

export type EntitlementStatus = "ACTIVE" | "CANCELLED" | "EXPIRED";

/** The fields of `GET /billing/entitlements` this screen needs. */
export interface AccountEntitlement {
  status: EntitlementStatus;
  expiresAt: string | null;
}

export interface EntitlementSummary {
  activeCount: number;
  /** The soonest an active entitlement expires, or null when nothing is active or nothing expires. */
  nearestExpiry: string | null;
}

/** How many apps are currently entitled, and the soonest one due to expire — for the "Hesabınız" card. */
export function summarizeEntitlements(entitlements: readonly AccountEntitlement[]): EntitlementSummary {
  const active = entitlements.filter((entitlement) => entitlement.status === "ACTIVE");
  const expiries = active
    .map((entitlement) => entitlement.expiresAt)
    .filter((expiresAt): expiresAt is string => expiresAt !== null)
    .sort();
  return { activeCount: active.length, nearestExpiry: expiries[0] ?? null };
}

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Beklemede",
  PAID: "Ödendi",
  FAILED: "Başarısız",
};

export const paymentStatusLabel = (status: PaymentStatus): string => PAYMENT_STATUS_LABELS[status];
