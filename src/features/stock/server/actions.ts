"use server";

import { revalidatePath } from "next/cache";
import { ROUTES } from "@/config/routes";
import { ApiError, apiFetch } from "@/lib/api-client";
import type {
  AdjustStockFormValues,
  StockCountLine,
  StockItem,
  StockItemFormValues,
} from "../model/stock-item";

function asError(error: unknown, fallback: string): Error {
  return error instanceof ApiError
    ? new Error(error.message)
    : new Error(fallback);
}

interface ApiStockItem {
  id: string;
  name: string;
  unitId: string;
  unit: { id: string; name: string };
  quantity: number;
  criticalLevel: number | null;
  unitCost: number | null;
}

const toStockItem = (item: ApiStockItem): StockItem => ({
  id: item.id,
  name: item.name,
  unitId: item.unitId,
  unitName: item.unit.name,
  quantity: item.quantity,
  ...(item.criticalLevel != null ? { criticalLevel: item.criticalLevel } : {}),
  ...(item.unitCost != null ? { unitCost: item.unitCost } : {}),
});

export async function fetchStockItems(): Promise<StockItem[]> {
  const items = await apiFetch<ApiStockItem[]>("/stock-items");
  return items.map(toStockItem);
}

export async function createStockItem(
  values: StockItemFormValues,
): Promise<StockItem> {
  try {
    const item = await apiFetch<ApiStockItem>("/stock-items", {
      method: "POST",
      body: values,
    });
    revalidatePath(ROUTES.stockList);
    return toStockItem(item);
  } catch (error) {
    throw asError(error, "Stok kartı eklenemedi");
  }
}

export async function updateStockItem(
  id: string,
  values: StockItemFormValues,
): Promise<StockItem> {
  try {
    const item = await apiFetch<ApiStockItem>(`/stock-items/${id}`, {
      method: "PATCH",
      body: values,
    });
    revalidatePath(ROUTES.stockList);
    return toStockItem(item);
  } catch (error) {
    throw asError(error, "Stok kartı güncellenemedi");
  }
}

export async function adjustStockItem(
  id: string,
  values: AdjustStockFormValues,
): Promise<StockItem> {
  try {
    const item = await apiFetch<ApiStockItem>(`/stock-items/${id}/adjust`, {
      method: "POST",
      body: values,
    });
    revalidatePath(ROUTES.stockList);
    return toStockItem(item);
  } catch (error) {
    throw asError(error, "Stok güncellenemedi");
  }
}

export async function countStockItems(counts: StockCountLine[]): Promise<void> {
  try {
    await apiFetch("/stock-items/count", { method: "POST", body: { counts } });
  } catch (error) {
    throw asError(error, "Sayım kaydedilemedi");
  }
  revalidatePath(ROUTES.stockList);
  revalidatePath(ROUTES.stockProductQuantity);
}

export async function deleteStockItem(id: string): Promise<void> {
  try {
    await apiFetch(`/stock-items/${id}`, { method: "DELETE" });
  } catch (error) {
    throw asError(error, "Stok kartı silinemedi");
  }
  revalidatePath(ROUTES.stockList);
}
