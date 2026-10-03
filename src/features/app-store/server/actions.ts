"use server";

import { revalidatePath } from "next/cache";
import { ROUTES } from "@/config/routes";
import { ApiError, apiFetch } from "@/lib/api-client";

const GENERIC_FAILURE_MESSAGE = "Satın alma işlemi tamamlanamadı";

export interface PurchaseAppResult {
  ok: boolean;
  message: string;
}

/**
 * Buys one app outright via `POST /billing/checkout` (mocked payment: api/ marks it paid immediately, no
 * gateway call). Monthly is the only period this screen offers for now — a period selector is a
 * nice-to-have, not required for this pass. Revalidates the store page so a bought app shows as installed
 * without a manual refresh.
 */
export async function purchaseApp(appId: string): Promise<PurchaseAppResult> {
  try {
    await apiFetch("/billing/checkout", { method: "POST", body: { appIds: [appId], period: "MONTHLY" } });
  } catch (error) {
    const message = error instanceof ApiError ? error.message : GENERIC_FAILURE_MESSAGE;
    return { ok: false, message };
  }

  revalidatePath(ROUTES.appStore);
  return { ok: true, message: "Uygulama mağazanıza eklendi" };
}
