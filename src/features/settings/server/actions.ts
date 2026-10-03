"use server";

import { revalidatePath } from "next/cache";
import { ROUTES } from "@/config/routes";
import { ApiError, apiFetch } from "@/lib/api-client";
import type { RestaurantSettingsFormInput, RestaurantSettingsFormValues } from "../model/restaurant-settings";

interface ApiRestaurantSettings {
  name: string;
  dayStart: string;
  dayEnd: string;
  lockSeconds: number;
  firstOrderNumber: number;
  notificationSound: string;
  workMode: string;
}

function asError(error: unknown, fallback: string): Error {
  return error instanceof ApiError ? new Error(error.message) : new Error(fallback);
}

/** The form's numeric fields are typed as text (see restaurantSettingsFormSchema); the API deals in numbers. */
export async function fetchRestaurantSettings(): Promise<RestaurantSettingsFormInput> {
  const settings = await apiFetch<ApiRestaurantSettings>("/settings/restaurant");
  return { ...settings, lockSeconds: String(settings.lockSeconds), firstOrderNumber: String(settings.firstOrderNumber) };
}

export async function updateRestaurantSettings(values: RestaurantSettingsFormValues): Promise<void> {
  try {
    await apiFetch("/settings/restaurant", { method: "PATCH", body: values });
  } catch (error) {
    throw asError(error, "Ayarlar güncellenemedi");
  }
  revalidatePath(ROUTES.restaurantSettings);
}
