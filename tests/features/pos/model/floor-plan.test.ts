import { describe, expect, it } from "vitest";
import { addProduct } from "@/features/pos/model/order";
import {
  MAX_BULK_TABLES,
  addTables,
  deleteArea,
  deleteTable,
  moveArea,
  saveArea,
  saveTable,
} from "@/features/pos/model/floor-plan";
import { createEmptyPosState, createOrder, updateOrder, type PosState } from "@/features/pos/model/pos-state";

const NOW = new Date("2026-09-21T12:00:00.000Z");

let sequence = 0;
const newId = () => `new-${++sequence}`;

const base = (): PosState => ({
  ...createEmptyPosState(),
  areas: [
    { id: "a1", name: "Salon" },
    { id: "a2", name: "Bahçe" },
  ],
  tables: [
    { id: "t1", name: "Masa 1", areaId: "a1", shape: "square" },
    { id: "t2", name: "Masa 2", areaId: "a1", shape: "square" },
    { id: "t3", name: "Bahçe 1", areaId: "a2", shape: "circle" },
  ],
});

const withBill = (state: PosState, tableId: string) =>
  updateOrder(createOrder(state, { id: `o-${tableId}`, type: "table", tableId, waiter: "ahmet", now: NOW }), `o-${tableId}`, (order) =>
    addProduct(order, { id: "p", name: "Çay", price: 5200 }, "l1")
  );

describe("saveArea", () => {
  it("adds an area", () => {
    const state = saveArea(base(), { id: null, name: " Teras " }, newId);

    expect(state.areas.map((area) => area.name)).toEqual(["Salon", "Bahçe", "Teras"]);
  });

  it("renames an area in place", () => {
    const state = saveArea(base(), { id: "a2", name: "Bahçe Katı" }, newId);

    expect(state.areas[1]).toEqual({ id: "a2", name: "Bahçe Katı" });
  });

  it("requires a name and refuses a duplicate", () => {
    expect(() => saveArea(base(), { id: null, name: "  " }, newId)).toThrow("Bölge adı zorunludur");
    expect(() => saveArea(base(), { id: null, name: "SALON" }, newId)).toThrow("Bu bölge zaten tanımlı");
  });

  it("lets an area keep its own name when it is edited", () => {
    expect(saveArea(base(), { id: "a1", name: "Salon" }, newId).areas).toHaveLength(2);
  });
});

describe("moveArea", () => {
  it("moves an area up or down one place", () => {
    expect(moveArea(base(), "a2", -1).areas.map((area) => area.id)).toEqual(["a2", "a1"]);
    expect(moveArea(base(), "a1", 1).areas.map((area) => area.id)).toEqual(["a2", "a1"]);
  });

  it("stays put at either end", () => {
    expect(moveArea(base(), "a1", -1).areas.map((area) => area.id)).toEqual(["a1", "a2"]);
    expect(moveArea(base(), "a2", 1).areas.map((area) => area.id)).toEqual(["a1", "a2"]);
  });
});

describe("deleteArea", () => {
  it("removes the area together with its tables", () => {
    const state = deleteArea(base(), "a2");

    expect(state.areas.map((area) => area.id)).toEqual(["a1"]);
    expect(state.tables.map((table) => table.id)).toEqual(["t1", "t2"]);
  });

  it("refuses while a table in it has a bill", () => {
    expect(() => deleteArea(withBill(base(), "t1"), "a1")).toThrow("Bölgede açık siparişi olan masa var");
  });

  it("drops the empty orders of the tables it removes", () => {
    const opened = createOrder(base(), { id: "o1", type: "table", tableId: "t3", waiter: "ahmet", now: NOW });

    expect(deleteArea(opened, "a2").orders).toEqual([]);
  });
});

describe("saveTable", () => {
  it("adds a table to an area", () => {
    const state = saveTable(base(), { id: null, name: "Masa 3", areaId: "a1", shape: "circle" }, newId);

    expect(state.tables.at(-1)).toMatchObject({ name: "Masa 3", areaId: "a1", shape: "circle" });
  });

  it("renames and reshapes a table", () => {
    const state = saveTable(base(), { id: "t1", name: "VIP", areaId: "a1", shape: "circle" }, newId);

    expect(state.tables[0]).toEqual({ id: "t1", name: "VIP", areaId: "a1", shape: "circle" });
  });

  it("requires a name, an existing area and a name nobody else uses", () => {
    expect(() => saveTable(base(), { id: null, name: " ", areaId: "a1", shape: "square" }, newId)).toThrow("Masa adı zorunludur");
    expect(() => saveTable(base(), { id: null, name: "Masa 9", areaId: "yok", shape: "square" }, newId)).toThrow("Bölge bulunamadı");
    expect(() => saveTable(base(), { id: null, name: "masa 1", areaId: "a2", shape: "square" }, newId)).toThrow("Bu masa adı zaten kullanılıyor");
  });

  it("refuses to move a table with a bill to another area", () => {
    expect(() => saveTable(withBill(base(), "t1"), { id: "t1", name: "Masa 1", areaId: "a2", shape: "square" }, newId)).toThrow(
      "Açık siparişi olan masa başka bölgeye taşınamaz"
    );
  });
});

describe("deleteTable", () => {
  it("removes a free table", () => {
    expect(deleteTable(base(), "t2").tables.map((table) => table.id)).toEqual(["t1", "t3"]);
  });

  it("refuses a table that has a bill", () => {
    expect(() => deleteTable(withBill(base(), "t1"), "t1")).toThrow("Açık siparişi olan masa silinemez");
  });

  it("drops an empty order left on the table", () => {
    const opened = createOrder(base(), { id: "o1", type: "table", tableId: "t1", waiter: "ahmet", now: NOW });

    expect(deleteTable(opened, "t1").orders).toEqual([]);
  });
});

describe("addTables", () => {
  it("adds numbered tables continuing after the highest number already used", () => {
    const state = addTables(base(), { areaId: "a1", prefix: "Masa", count: 3, shape: "square" }, newId);

    expect(state.tables.slice(3).map((table) => table.name)).toEqual(["Masa 3", "Masa 4", "Masa 5"]);
  });

  it("starts at 1 for a new prefix", () => {
    const state = addTables(base(), { areaId: "a2", prefix: "Teras", count: 2, shape: "circle" }, newId);

    expect(state.tables.slice(3).map((table) => [table.name, table.areaId, table.shape])).toEqual([
      ["Teras 1", "a2", "circle"],
      ["Teras 2", "a2", "circle"],
    ]);
  });

  it("uses the prefix as the whole name for a single table", () => {
    const state = addTables(base(), { areaId: "a1", prefix: "Bar", count: 1, shape: "square" }, newId);

    expect(state.tables.at(-1)?.name).toBe("Bar");
  });

  it("does not create a single table over a name that is taken", () => {
    expect(() => addTables(base(), { areaId: "a1", prefix: "Masa 1", count: 1, shape: "square" }, newId)).toThrow(
      "Bu masa adı zaten kullanılıyor"
    );
  });

  it.each([0, -1, 1.5, MAX_BULK_TABLES + 1])("rejects a count of %s", (count) => {
    expect(() => addTables(base(), { areaId: "a1", prefix: "Masa", count, shape: "square" }, newId)).toThrow(
      `Adet 1 ile ${MAX_BULK_TABLES} arasında olmalıdır`
    );
  });

  it("requires a prefix and an existing area", () => {
    expect(() => addTables(base(), { areaId: "a1", prefix: " ", count: 2, shape: "square" }, newId)).toThrow("Masa adı zorunludur");
    expect(() => addTables(base(), { areaId: "yok", prefix: "Masa", count: 2, shape: "square" }, newId)).toThrow("Bölge bulunamadı");
  });

  it("never mutates the state it was given", () => {
    const state = base();
    const snapshot = structuredClone(state);

    addTables(state, { areaId: "a1", prefix: "Masa", count: 3, shape: "square" }, newId);
    deleteTable(state, "t1");
    moveArea(state, "a2", -1);

    expect(state).toEqual(snapshot);
  });
});
