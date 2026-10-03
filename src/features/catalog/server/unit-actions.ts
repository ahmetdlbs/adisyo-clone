"use server";

import { revalidatePath } from "next/cache";
import { ROUTES } from "@/config/routes";
import { ApiError, apiFetch } from "@/lib/api-client";
import type { Unit, UnitFormValues } from "../model/unit";

function asError(error: unknown, fallback: string): Error {
  return error instanceof ApiError ? new Error(error.message) : new Error(fallback);
}

export async function createUnit(values: UnitFormValues): Promise<Unit> {
  try {
    const unit = await apiFetch<Unit>("/units", { method: "POST", body: values });
    revalidatePath(ROUTES.productUnits);
    return unit;
  } catch (error) {
    throw asError(error, "Birim eklenemedi");
  }
}

export async function updateUnit(id: string, values: UnitFormValues): Promise<Unit> {
  try {
    const unit = await apiFetch<Unit>(`/units/${id}`, { method: "PATCH", body: values });
    revalidatePath(ROUTES.productUnits);
    return unit;
  } catch (error) {
    throw asError(error, "Birim güncellenemedi");
  }
}

export async function deleteUnit(id: string): Promise<void> {
  try {
    await apiFetch(`/units/${id}`, { method: "DELETE" });
  } catch (error) {
    throw asError(error, "Birim silinemedi");
  }
  revalidatePath(ROUTES.productUnits);
}
