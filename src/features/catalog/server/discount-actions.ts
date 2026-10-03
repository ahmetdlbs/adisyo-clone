"use server";

import { revalidatePath } from "next/cache";
import { ROUTES } from "@/config/routes";
import { ApiError, apiFetch } from "@/lib/api-client";
import type { Discount, DiscountFormValues } from "../model/discount";
import { toDiscount, upper } from "./adapt";
import type { ApiDiscount } from "./wire-types";

function asError(error: unknown, fallback: string): Error {
  return error instanceof ApiError ? new Error(error.message) : new Error(fallback);
}

export async function fetchDiscounts(): Promise<Discount[]> {
  const discounts = await apiFetch<ApiDiscount[]>("/discounts");
  return discounts.map(toDiscount);
}

export async function createDiscount(values: DiscountFormValues): Promise<Discount> {
  try {
    const discount = await apiFetch<ApiDiscount>("/discounts", { method: "POST", body: { ...values, type: upper(values.type) } });
    revalidatePath(ROUTES.discounts);
    return toDiscount(discount);
  } catch (error) {
    throw asError(error, "İndirim eklenemedi");
  }
}

export async function updateDiscount(id: string, values: DiscountFormValues): Promise<Discount> {
  try {
    const discount = await apiFetch<ApiDiscount>(`/discounts/${id}`, { method: "PATCH", body: { ...values, type: upper(values.type) } });
    revalidatePath(ROUTES.discounts);
    return toDiscount(discount);
  } catch (error) {
    throw asError(error, "İndirim güncellenemedi");
  }
}

export async function deleteDiscount(id: string): Promise<void> {
  try {
    await apiFetch(`/discounts/${id}`, { method: "DELETE" });
  } catch (error) {
    throw asError(error, "İndirim silinemedi");
  }
  revalidatePath(ROUTES.discounts);
}
