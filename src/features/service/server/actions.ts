"use server";

import { revalidatePath } from "next/cache";
import { ROUTES } from "@/config/routes";
import { ApiError, apiFetch } from "@/lib/api-client";
import type { ServiceCharge, ServiceSettings } from "../model/service-charge";

function asError(error: unknown, fallback: string): Error {
  return error instanceof ApiError ? new Error(error.message) : new Error(fallback);
}

export async function fetchServiceSettings(): Promise<ServiceSettings> {
  return apiFetch<ServiceSettings>("/settings/service-charges");
}

export async function saveKuver(charge: ServiceCharge): Promise<ServiceCharge> {
  try {
    const saved = await apiFetch<ServiceCharge>("/settings/service-charges/kuver", { method: "PATCH", body: charge });
    revalidatePath(ROUTES.serviceOperations);
    return saved;
  } catch (error) {
    throw asError(error, "Kuver ayarları kaydedilemedi");
  }
}

export async function saveGarsoniye(charge: ServiceCharge): Promise<ServiceCharge> {
  try {
    const saved = await apiFetch<ServiceCharge>("/settings/service-charges/garsoniye", { method: "PATCH", body: charge });
    revalidatePath(ROUTES.serviceOperations);
    return saved;
  } catch (error) {
    throw asError(error, "Garsoniye ayarları kaydedilemedi");
  }
}
