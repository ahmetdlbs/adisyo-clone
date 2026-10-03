"use server";

import { apiFetch } from "@/lib/api-client";
import type { AccountEntitlement, AccountPayment } from "../model/account";

export async function fetchAccountEntitlements(): Promise<AccountEntitlement[]> {
  return apiFetch<AccountEntitlement[]>("/billing/entitlements");
}

export async function fetchAccountPayments(): Promise<AccountPayment[]> {
  return apiFetch<AccountPayment[]>("/billing/payments");
}
