export type IntegrationStatus = "DISCONNECTED" | "PENDING" | "CONNECTED" | "ERROR";

export interface IntegrationField {
  name: string;
  label: string;
  /** Write-only: the API never sends a secret back, only whether one is stored. */
  secret: boolean;
  help: string;
  isFilled: boolean;
  /** The stored value of a non-secret field; always null for a secret. */
  value: string | null;
}

/** One delivery platform and where this restaurant's setup of it stands — `GET /integrations`. */
export interface Integration {
  provider: string;
  label: string;
  appKey: string;
  /** False until the restaurant buys (or renews) the App Store app for this platform. */
  isAppActive: boolean;
  status: IntegrationStatus;
  connectedAt: string | null;
  fields: IntegrationField[];
}

export const STATUS_LABELS: Record<IntegrationStatus, string> = {
  DISCONNECTED: "Bağlı değil",
  PENDING: "Aktivasyon bekliyor",
  CONNECTED: "Bağlı",
  ERROR: "Hata",
};

export const STATUS_HINTS: Record<IntegrationStatus, string> = {
  DISCONNECTED: "Bağlantı bilgilerinizi girin.",
  PENDING: "Bilgileriniz güvenle saklandı. Platform doğrulaması tamamlanınca siparişler otomatik düşmeye başlar.",
  CONNECTED: "Siparişler adisyona otomatik düşüyor.",
  ERROR: "Platform bağlantıyı reddetti. Bilgilerinizi kontrol edip yeniden kaydedin.",
};

/** What the form should send, or the first problem: every field is required, except that a secret already stored may stay blank. */
export function validateCredentials(
  fields: readonly IntegrationField[],
  values: Readonly<Record<string, string>>
): { ok: true; credentials: Record<string, string> } | { ok: false; message: string } {
  const credentials: Record<string, string> = {};
  for (const field of fields) {
    const typed = (values[field.name] ?? "").trim();
    if (typed === "" && !(field.secret && field.isFilled)) {
      return { ok: false, message: `${field.label} zorunludur` };
    }
    credentials[field.name] = typed;
  }
  return { ok: true, credentials };
}
