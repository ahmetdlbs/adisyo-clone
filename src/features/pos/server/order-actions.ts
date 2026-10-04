"use server";

import { ApiError, apiFetch } from "@/lib/api-client";
import type { Kurus } from "@/lib/money";
import type { Order, OrderType, PaymentMethod } from "../model/order";
import { toOrder, upper } from "./adapt";
import type { ApiOrder } from "./wire-types";

function asError(error: unknown, fallback: string): Error {
  return error instanceof ApiError ? new Error(error.message) : new Error(fallback);
}

export async function fetchOpenOrders(): Promise<Order[]> {
  const orders = await apiFetch<ApiOrder[]>("/orders");
  return orders.map(toOrder);
}

export async function fetchOrder(orderId: string): Promise<Order> {
  const order = await apiFetch<ApiOrder>(`/orders/${orderId}`);
  return toOrder(order);
}

export interface OpenOrderInput {
  type: OrderType;
  tableId: string | null;
  customerName?: string;
  waiter: string;
}

/** Opens an order. Throws when the table is taken or unknown. */
export async function openOrderAction(input: OpenOrderInput): Promise<Order> {
  try {
    const order = await apiFetch<ApiOrder>("/orders", {
      method: "POST",
      body: {
        type: upper(input.type),
        ...(input.type === "table" && input.tableId ? { tableId: input.tableId } : {}),
        ...(input.customerName ? { customerName: input.customerName } : {}),
        waiter: input.waiter,
      },
    });
    return toOrder(order);
  } catch (error) {
    throw asError(error, "Sipariş açılamadı");
  }
}

export async function addProductAction(orderId: string, productId: string, portionId: string): Promise<Order> {
  try {
    return toOrder(
      await apiFetch<ApiOrder>(`/orders/${orderId}/lines`, { method: "POST", body: { productId, portionId } })
    );
  } catch (error) {
    throw asError(error, "Ürün eklenemedi");
  }
}

export async function decrementProductAction(orderId: string, productId: string, portionId: string): Promise<Order> {
  try {
    return toOrder(
      await apiFetch<ApiOrder>(`/orders/${orderId}/lines/decrement`, {
        method: "POST",
        body: { productId, portionId },
      })
    );
  } catch (error) {
    throw asError(error, "Ürün çıkarılamadı");
  }
}

export async function removeLineAction(orderId: string, lineId: string): Promise<Order> {
  try {
    return toOrder(await apiFetch<ApiOrder>(`/orders/${orderId}/lines/${lineId}`, { method: "DELETE" }));
  } catch (error) {
    throw asError(error, "Kalem silinemedi");
  }
}

export async function toggleComplimentaryAction(orderId: string, lineId: string): Promise<Order> {
  try {
    return toOrder(
      await apiFetch<ApiOrder>(`/orders/${orderId}/lines/${lineId}/toggle-complimentary`, { method: "POST" })
    );
  } catch (error) {
    throw asError(error, "İşlem yapılamadı");
  }
}

export async function setChargesAction(orderId: string, charges: { kuver: boolean; garsoniye: boolean }): Promise<Order> {
  try {
    return toOrder(await apiFetch<ApiOrder>(`/orders/${orderId}/charges`, { method: "PUT", body: charges }));
  } catch (error) {
    throw asError(error, "Servis ücreti güncellenemedi");
  }
}

export async function setGuestsAction(orderId: string, count: number): Promise<Order> {
  try {
    return toOrder(await apiFetch<ApiOrder>(`/orders/${orderId}/guests`, { method: "PUT", body: { count } }));
  } catch (error) {
    throw asError(error, "Kişi sayısı güncellenemedi");
  }
}

export async function resetOrderAction(orderId: string): Promise<Order> {
  try {
    return toOrder(await apiFetch<ApiOrder>(`/orders/${orderId}/reset`, { method: "POST" }));
  } catch (error) {
    throw asError(error, "Sipariş temizlenemedi");
  }
}

export async function setDiscountAction(orderId: string, percent: number): Promise<Order> {
  try {
    return toOrder(await apiFetch<ApiOrder>(`/orders/${orderId}/discount`, { method: "POST", body: { percent } }));
  } catch (error) {
    throw asError(error, "İndirim uygulanamadı");
  }
}

export interface PaymentInput {
  method: PaymentMethod;
  tendered: Kurus;
  lineIds?: readonly string[];
  customerId?: string;
}

export async function applyPaymentAction(orderId: string, input: PaymentInput): Promise<{ order: Order; change: Kurus }> {
  try {
    const result = await apiFetch<{ order: ApiOrder; change: number }>(`/orders/${orderId}/payments`, {
      method: "POST",
      body: {
        method: upper(input.method),
        tendered: input.tendered,
        lineIds: input.lineIds ?? [],
        ...(input.customerId ? { customerId: input.customerId } : {}),
      },
    });
    return { order: toOrder(result.order), change: result.change };
  } catch (error) {
    throw asError(error, "Ödeme alınamadı");
  }
}

export async function closeOrderAction(orderId: string): Promise<Order> {
  try {
    return toOrder(await apiFetch<ApiOrder>(`/orders/${orderId}/close`, { method: "POST" }));
  } catch (error) {
    throw asError(error, "Sipariş kapatılamadı");
  }
}

export async function cancelOrderAction(orderId: string): Promise<Order> {
  try {
    return toOrder(await apiFetch<ApiOrder>(`/orders/${orderId}/cancel`, { method: "POST" }));
  } catch (error) {
    throw asError(error, "Sipariş iptal edilemedi");
  }
}

export async function discardEmptyOrderAction(orderId: string): Promise<void> {
  try {
    await apiFetch(`/orders/${orderId}`, { method: "DELETE" });
  } catch (error) {
    // 409: the bill got an item (maybe from another terminal) after "back" was pressed — it simply stays open.
    if (error instanceof ApiError && error.status === 409) return;
    throw error;
  }
}

export async function moveOrderToTableAction(orderId: string, tableId: string): Promise<Order> {
  try {
    return toOrder(await apiFetch<ApiOrder>(`/orders/${orderId}/move-table`, { method: "POST", body: { tableId } }));
  } catch (error) {
    throw asError(error, "Sipariş taşınamadı");
  }
}

export async function markReadyAction(orderId: string): Promise<Order> {
  try {
    return toOrder(await apiFetch<ApiOrder>(`/orders/${orderId}/mark-ready`, { method: "POST" }));
  } catch (error) {
    throw asError(error, "İşlem yapılamadı");
  }
}

export async function dispatchDeliveryAction(orderId: string): Promise<Order> {
  try {
    return toOrder(await apiFetch<ApiOrder>(`/orders/${orderId}/dispatch`, { method: "POST" }));
  } catch (error) {
    throw asError(error, "Teslimata çıkarılamadı");
  }
}
