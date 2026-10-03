"use server";

import { ApiError, apiFetch } from "@/lib/api-client";
import { toOrder } from "@/features/pos/server/adapt";
import type { ApiOrder } from "@/features/pos/server/wire-types";
import type { Order } from "@/features/pos/model/order";
import type { DaySummary, ProductSales } from "../../pos/model/stats";
import { toDaySummary, toProductSales } from "./adapt";
import type { ApiDaySummary, ApiProductSales } from "./wire-types";

function asError(error: unknown, fallback: string): Error {
  return error instanceof ApiError ? new Error(error.message) : new Error(fallback);
}

/** ISO date -> `?date=...` query string, or "" for the API's own default (today, server time zone). */
const dateQuery = (date?: string): string => (date ? `?date=${encodeURIComponent(date)}` : "");

export async function fetchDaySummary(date?: string): Promise<DaySummary> {
  try {
    return toDaySummary(await apiFetch<ApiDaySummary>(`/reports/day-summary${dateQuery(date)}`));
  } catch (error) {
    throw asError(error, "Gün özeti alınamadı");
  }
}

export async function fetchProductSales(date?: string): Promise<ProductSales[]> {
  try {
    const sales = await apiFetch<ApiProductSales[]>(`/reports/product-sales${dateQuery(date)}`);
    return sales.map(toProductSales);
  } catch (error) {
    throw asError(error, "Ürün satışları alınamadı");
  }
}

export async function fetchClosedOrders(date?: string): Promise<Order[]> {
  try {
    const orders = await apiFetch<ApiOrder[]>(`/reports/closed-orders${dateQuery(date)}`);
    return orders.map(toOrder);
  } catch (error) {
    throw asError(error, "Kapanan adisyonlar alınamadı");
  }
}
