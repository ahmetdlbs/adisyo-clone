"use server";

import { revalidatePath } from "next/cache";
import { ROUTES } from "@/config/routes";
import { ApiError, apiFetch } from "@/lib/api-client";
import type { KitchenGroup, KitchenGroupFormValues } from "../model/kitchen-group";

function asError(error: unknown, fallback: string): Error {
  return error instanceof ApiError ? new Error(error.message) : new Error(fallback);
}

export async function createKitchenGroup(values: KitchenGroupFormValues): Promise<KitchenGroup> {
  try {
    const group = await apiFetch<KitchenGroup>("/kitchen-groups", { method: "POST", body: values });
    revalidatePath(ROUTES.kitchenGroups);
    return group;
  } catch (error) {
    throw asError(error, "Mutfak grubu eklenemedi");
  }
}

export async function updateKitchenGroup(id: string, values: KitchenGroupFormValues): Promise<KitchenGroup> {
  try {
    const group = await apiFetch<KitchenGroup>(`/kitchen-groups/${id}`, { method: "PATCH", body: values });
    revalidatePath(ROUTES.kitchenGroups);
    return group;
  } catch (error) {
    throw asError(error, "Mutfak grubu güncellenemedi");
  }
}

export async function deleteKitchenGroup(id: string): Promise<void> {
  try {
    await apiFetch(`/kitchen-groups/${id}`, { method: "DELETE" });
  } catch (error) {
    throw asError(error, "Mutfak grubu silinemedi");
  }
  revalidatePath(ROUTES.kitchenGroups);
}
