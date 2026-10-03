"use server";

import { ApiError, apiFetch } from "@/lib/api-client";
import type { Area, TableDefinition } from "../model/pos-state";
import { toArea, toTable, upper } from "./adapt";
import type { ApiArea, ApiTable } from "./wire-types";

function asError(error: unknown, fallback: string): Error {
  return error instanceof ApiError ? new Error(error.message) : new Error(fallback);
}

// ── Areas ─────────────────────────────────────────────────────────────────

export async function fetchAreas(): Promise<Area[]> {
  const areas = await apiFetch<ApiArea[]>("/areas");
  return areas.map(toArea);
}

export async function saveAreaAction(id: string | null, name: string): Promise<Area> {
  try {
    const area = id
      ? await apiFetch<ApiArea>(`/areas/${id}`, { method: "PATCH", body: { name } })
      : await apiFetch<ApiArea>("/areas", { method: "POST", body: { name } });
    return toArea(area);
  } catch (error) {
    throw asError(error, "Bölge kaydedilemedi");
  }
}

export async function moveAreaAction(id: string, offset: -1 | 1): Promise<Area[]> {
  try {
    const areas = await apiFetch<ApiArea[]>(`/areas/${id}/move`, { method: "POST", body: { offset } });
    return areas.map(toArea);
  } catch (error) {
    throw asError(error, "Bölge taşınamadı");
  }
}

export async function deleteAreaAction(id: string): Promise<void> {
  try {
    await apiFetch(`/areas/${id}`, { method: "DELETE" });
  } catch (error) {
    throw asError(error, "Bölge silinemedi");
  }
}

// ── Tables ────────────────────────────────────────────────────────────────

export async function fetchTables(): Promise<TableDefinition[]> {
  const tables = await apiFetch<ApiTable[]>("/tables");
  return tables.map(toTable);
}

export interface TableFormInput {
  name: string;
  areaId: string;
  shape: "square" | "circle";
}

export async function saveTableAction(id: string | null, values: TableFormInput): Promise<TableDefinition> {
  const body = { name: values.name, areaId: values.areaId, shape: upper(values.shape) };
  try {
    const table = id
      ? await apiFetch<ApiTable>(`/tables/${id}`, { method: "PATCH", body })
      : await apiFetch<ApiTable>("/tables", { method: "POST", body });
    return toTable(table);
  } catch (error) {
    throw asError(error, "Masa kaydedilemedi");
  }
}

export async function deleteTableAction(id: string): Promise<void> {
  try {
    await apiFetch(`/tables/${id}`, { method: "DELETE" });
  } catch (error) {
    throw asError(error, "Masa silinemedi");
  }
}

export interface BulkTablesInput {
  prefix: string;
  count: number;
  areaId: string;
  shape: "square" | "circle";
}

export async function addTablesAction(values: BulkTablesInput): Promise<TableDefinition[]> {
  try {
    const tables = await apiFetch<ApiTable[]>("/tables/bulk", {
      method: "POST",
      body: { ...values, shape: upper(values.shape) },
    });
    return tables.map(toTable);
  } catch (error) {
    throw asError(error, "Masalar eklenemedi");
  }
}
