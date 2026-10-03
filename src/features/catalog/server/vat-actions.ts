"use server";

import { revalidatePath } from "next/cache";
import { ROUTES } from "@/config/routes";
import { ApiError, apiFetch } from "@/lib/api-client";
import type { VatDefinition, VatFormValues } from "../model/vat";

function asError(error: unknown, fallback: string): Error {
  return error instanceof ApiError ? new Error(error.message) : new Error(fallback);
}

/** Adds a definition. Throws once the API's own cap (see MAX_VAT_DEFINITIONS) is reached. */
export async function createVat(values: VatFormValues): Promise<VatDefinition> {
  try {
    const vat = await apiFetch<VatDefinition>("/vat-definitions", { method: "POST", body: values });
    revalidatePath(ROUTES.vatDefinitions);
    return vat;
  } catch (error) {
    throw asError(error, "KDV grubu eklenemedi");
  }
}

export async function updateVat(id: string, values: VatFormValues): Promise<VatDefinition> {
  try {
    const vat = await apiFetch<VatDefinition>(`/vat-definitions/${id}`, { method: "PATCH", body: values });
    revalidatePath(ROUTES.vatDefinitions);
    return vat;
  } catch (error) {
    throw asError(error, "KDV grubu güncellenemedi");
  }
}

export async function deleteVat(id: string): Promise<void> {
  try {
    await apiFetch(`/vat-definitions/${id}`, { method: "DELETE" });
  } catch (error) {
    throw asError(error, "KDV grubu silinemedi");
  }
  revalidatePath(ROUTES.vatDefinitions);
}
