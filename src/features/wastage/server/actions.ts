"use server";

import { revalidatePath } from "next/cache";
import { ROUTES } from "@/config/routes";
import { ApiError, apiFetch } from "@/lib/api-client";
import type { Wastage, WastageFormValues } from "../model/wastage";

/** Records a wastage entry — append-only, same reasoning as expenses: no update/delete. */
export async function createWastage(values: WastageFormValues): Promise<Wastage> {
  try {
    const wastage = await apiFetch<Wastage>("/wastage", { method: "POST", body: values });
    revalidatePath(ROUTES.restaurantWastages);
    return wastage;
  } catch (error) {
    throw error instanceof ApiError ? new Error(error.message) : new Error("Zayi eklenemedi");
  }
}
