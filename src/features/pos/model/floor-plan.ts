import { isNameTaken, upsertById } from "@/lib/collection";
import { orderForTable, type Area, type PosState, type TableDefinition, type TableShape } from "./pos-state";

export const MAX_BULK_TABLES = 100;

const fold = (text: string) => text.trim().toLocaleLowerCase("tr");
const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** A table has a bill when something is on it or money was already taken. An empty order does not count. */
function hasBill(state: PosState, tableId: string): boolean {
  const order = orderForTable(state, tableId);
  return order !== undefined && (order.lines.length > 0 || order.payments.length > 0);
}

/** Drops the (necessarily empty) orders of tables that are about to disappear. */
const withoutOrdersOf = (state: PosState, tableIds: readonly string[]): PosState => ({
  ...state,
  orders: state.orders.filter((order) => !(order.type === "table" && order.tableId !== null && tableIds.includes(order.tableId))),
});

// ── Areas ───────────────────────────────────────────────────────────────────

export function saveArea(state: PosState, input: { id: string | null; name: string }, newId: () => string): PosState {
  const name = input.name.trim();
  if (name === "") throw new Error("Bölge adı zorunludur");
  if (isNameTaken(state.areas, name, input.id)) throw new Error("Bu bölge zaten tanımlı");
  if (input.id !== null && !state.areas.some((area) => area.id === input.id)) throw new Error("Bölge bulunamadı");

  const area: Area = { id: input.id ?? newId(), name };
  return { ...state, areas: upsertById(state.areas, area) };
}

/** Moves an area one place up (-1) or down (+1) in the tab order; it stays put at either end. */
export function moveArea(state: PosState, areaId: string, offset: -1 | 1): PosState {
  const from = state.areas.findIndex((area) => area.id === areaId);
  const to = from + offset;
  if (from === -1 || to < 0 || to >= state.areas.length) return state;

  const areas = [...state.areas];
  [areas[from], areas[to]] = [areas[to]!, areas[from]!];
  return { ...state, areas };
}

/** Deletes an area with all its tables. Refuses while any of them has a bill. */
export function deleteArea(state: PosState, areaId: string): PosState {
  const tableIds = state.tables.filter((table) => table.areaId === areaId).map((table) => table.id);
  if (tableIds.some((tableId) => hasBill(state, tableId))) throw new Error("Bölgede açık siparişi olan masa var");

  return withoutOrdersOf(
    {
      ...state,
      areas: state.areas.filter((area) => area.id !== areaId),
      tables: state.tables.filter((table) => table.areaId !== areaId),
    },
    tableIds
  );
}

// ── Tables ──────────────────────────────────────────────────────────────────

export interface TableInput {
  id: string | null;
  name: string;
  areaId: string;
  shape: TableShape;
}

export function saveTable(state: PosState, input: TableInput, newId: () => string): PosState {
  const name = input.name.trim();
  if (name === "") throw new Error("Masa adı zorunludur");
  if (!state.areas.some((area) => area.id === input.areaId)) throw new Error("Bölge bulunamadı");
  if (isNameTaken(state.tables, name, input.id)) throw new Error("Bu masa adı zaten kullanılıyor");

  if (input.id !== null) {
    const existing = state.tables.find((table) => table.id === input.id);
    if (!existing) throw new Error("Masa bulunamadı");
    if (existing.areaId !== input.areaId && hasBill(state, existing.id)) {
      throw new Error("Açık siparişi olan masa başka bölgeye taşınamaz");
    }
  }

  const table: TableDefinition = { id: input.id ?? newId(), name, areaId: input.areaId, shape: input.shape };
  return { ...state, tables: upsertById(state.tables, table) };
}

export function deleteTable(state: PosState, tableId: string): PosState {
  if (hasBill(state, tableId)) throw new Error("Açık siparişi olan masa silinemez");
  return withoutOrdersOf({ ...state, tables: state.tables.filter((table) => table.id !== tableId) }, [tableId]);
}

export interface BulkTablesInput {
  areaId: string;
  prefix: string;
  count: number;
  shape: TableShape;
}

/**
 * Adds `count` tables named "<prefix> <n>", numbered on from the highest number that prefix already uses.
 * A count of 1 uses the prefix as the whole name.
 */
export function addTables(state: PosState, input: BulkTablesInput, newId: () => string): PosState {
  const prefix = input.prefix.trim();
  if (prefix === "") throw new Error("Masa adı zorunludur");
  if (!state.areas.some((area) => area.id === input.areaId)) throw new Error("Bölge bulunamadı");
  if (!Number.isInteger(input.count) || input.count < 1 || input.count > MAX_BULK_TABLES) {
    throw new RangeError(`Adet 1 ile ${MAX_BULK_TABLES} arasında olmalıdır`);
  }

  let names: string[];
  if (input.count === 1) {
    if (isNameTaken(state.tables, prefix)) throw new Error("Bu masa adı zaten kullanılıyor");
    names = [prefix];
  } else {
    const numbered = new RegExp(`^${escapeRegExp(fold(prefix))} (\\d+)$`);
    const highest = state.tables.reduce((max, table) => Math.max(max, Number(numbered.exec(fold(table.name))?.[1] ?? 0)), 0);
    names = Array.from({ length: input.count }, (_, index) => `${prefix} ${highest + index + 1}`);
  }

  const added = names.map((name): TableDefinition => ({ id: newId(), name, areaId: input.areaId, shape: input.shape }));
  return { ...state, tables: [...state.tables, ...added] };
}
