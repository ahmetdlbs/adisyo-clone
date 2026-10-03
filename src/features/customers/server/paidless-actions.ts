"use server";

import { revalidatePath } from "next/cache";
import { ROUTES } from "@/config/routes";
import { ApiError, apiFetch } from "@/lib/api-client";
import type { Paidless, PaidlessFormValues } from "../model/paidless";

function asError(error: unknown, fallback: string): Error {
  return error instanceof ApiError ? new Error(error.message) : new Error(fallback);
}

/** Adds a person. Throws (message meant for the first-name field) when the full name is already listed. */
export async function createPaidless(values: PaidlessFormValues): Promise<Paidless> {
  try {
    const person = await apiFetch<Paidless>("/paidless", { method: "POST", body: values });
    revalidatePath(ROUTES.restaurantPaidlesses);
    return person;
  } catch (error) {
    throw asError(error, "Ödenmez eklenemedi");
  }
}

export async function updatePaidless(id: string, values: PaidlessFormValues): Promise<Paidless> {
  try {
    const person = await apiFetch<Paidless>(`/paidless/${id}`, { method: "PATCH", body: values });
    revalidatePath(ROUTES.restaurantPaidlesses);
    return person;
  } catch (error) {
    throw asError(error, "Ödenmez güncellenemedi");
  }
}

export async function deletePaidless(id: string): Promise<void> {
  try {
    await apiFetch(`/paidless/${id}`, { method: "DELETE" });
  } catch (error) {
    throw asError(error, "Ödenmez silinemedi");
  }
  revalidatePath(ROUTES.restaurantPaidlesses);
}
