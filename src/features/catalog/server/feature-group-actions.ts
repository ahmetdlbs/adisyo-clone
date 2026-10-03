"use server";

import { revalidatePath } from "next/cache";
import { ROUTES } from "@/config/routes";
import { ApiError, apiFetch } from "@/lib/api-client";
import type { FeatureGroup, FeatureGroupFormValues } from "../model/feature-group";
import { toFeatureGroup, upper } from "./adapt";
import type { ApiFeatureGroup } from "./wire-types";

function asError(error: unknown, fallback: string): Error {
  return error instanceof ApiError ? new Error(error.message) : new Error(fallback);
}

/** The API assigns each option's real id; the form's `id` is only a react-hook-form field-array key. */
function toBody(values: FeatureGroupFormValues) {
  return {
    ...values,
    selectionType: upper(values.selectionType),
    options: values.options.map((option) => ({ name: option.name, price: option.price, isDefault: option.isDefault })),
  };
}

export async function fetchFeatureGroups(): Promise<FeatureGroup[]> {
  const groups = await apiFetch<ApiFeatureGroup[]>("/feature-groups");
  return groups.map(toFeatureGroup);
}

export async function createFeatureGroup(values: FeatureGroupFormValues): Promise<FeatureGroup> {
  try {
    const group = await apiFetch<ApiFeatureGroup>("/feature-groups", { method: "POST", body: toBody(values) });
    revalidatePath(ROUTES.features);
    return toFeatureGroup(group);
  } catch (error) {
    throw asError(error, "Özellik grubu eklenemedi");
  }
}

export async function updateFeatureGroup(id: string, values: FeatureGroupFormValues): Promise<FeatureGroup> {
  try {
    const group = await apiFetch<ApiFeatureGroup>(`/feature-groups/${id}`, { method: "PATCH", body: toBody(values) });
    revalidatePath(ROUTES.features);
    return toFeatureGroup(group);
  } catch (error) {
    throw asError(error, "Özellik grubu güncellenemedi");
  }
}

export async function deleteFeatureGroup(id: string): Promise<void> {
  try {
    await apiFetch(`/feature-groups/${id}`, { method: "DELETE" });
  } catch (error) {
    throw asError(error, "Özellik grubu silinemedi");
  }
  revalidatePath(ROUTES.features);
}
