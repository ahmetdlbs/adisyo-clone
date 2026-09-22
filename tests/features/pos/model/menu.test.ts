import { describe, expect, it } from "vitest";
import { deleteCategory, deleteProduct, saveCategory, saveProduct } from "@/features/pos/model/menu";
import { createEmptyPosState, type PosState } from "@/features/pos/model/pos-state";

let sequence = 0;
const newId = () => `new-${++sequence}`;

const base = (): PosState => ({
  ...createEmptyPosState(),
  categories: [
    { id: "c1", name: "İçecekler" },
    { id: "c2", name: "Tatlılar" },
  ],
  products: [
    { id: "p1", name: "Çay", categoryId: "c1", price: 5200, isFavorite: true },
    { id: "p2", name: "Cheesecake", categoryId: "c2", price: 19500, isFavorite: false },
  ],
});

const product = (overrides: Partial<Parameters<typeof saveProduct>[1]> = {}) => ({
  id: null,
  name: "Limonata",
  categoryId: "c1",
  price: 7500,
  isFavorite: false,
  ...overrides,
});

describe("saveCategory", () => {
  it("adds and renames categories", () => {
    const added = saveCategory(base(), { id: null, name: " Salatalar " }, newId);
    const renamed = saveCategory(base(), { id: "c1", name: "Soğuk İçecekler" }, newId);

    expect(added.categories.at(-1)?.name).toBe("Salatalar");
    expect(renamed.categories[0]).toEqual({ id: "c1", name: "Soğuk İçecekler" });
  });

  it("requires a name and refuses a duplicate", () => {
    expect(() => saveCategory(base(), { id: null, name: "" }, newId)).toThrow("Kategori adı zorunludur");
    expect(() => saveCategory(base(), { id: null, name: "TATLILAR" }, newId)).toThrow("Bu kategori zaten tanımlı");
  });
});

describe("deleteCategory", () => {
  it("removes an empty category", () => {
    const state = saveCategory(base(), { id: null, name: "Salatalar" }, () => "c3");

    expect(deleteCategory(state, "c3").categories.map((category) => category.id)).toEqual(["c1", "c2"]);
  });

  it("refuses a category that still has products", () => {
    expect(() => deleteCategory(base(), "c1")).toThrow("Kategoride ürün var");
  });
});

describe("saveProduct", () => {
  it("adds a product", () => {
    const state = saveProduct(base(), product(), newId);

    expect(state.products.at(-1)).toMatchObject({ name: "Limonata", categoryId: "c1", price: 7500, isFavorite: false });
  });

  it("updates a product in place", () => {
    const state = saveProduct(base(), product({ id: "p1", name: "Demli Çay", price: 5500 }), newId);

    expect(state.products[0]).toMatchObject({ id: "p1", name: "Demli Çay", price: 5500 });
  });

  it("keeps a barcode only when one was given", () => {
    expect(saveProduct(base(), product({ barcode: " 8690000000012 " }), newId).products.at(-1)?.barcode).toBe("8690000000012");
    expect(saveProduct(base(), product({ barcode: "  " }), newId).products.at(-1)).not.toHaveProperty("barcode");
  });

  it("requires a name, a real category and a positive whole-kuruş price", () => {
    expect(() => saveProduct(base(), product({ name: " " }), newId)).toThrow("Ürün adı zorunludur");
    expect(() => saveProduct(base(), product({ categoryId: "yok" }), newId)).toThrow("Kategori bulunamadı");
    expect(() => saveProduct(base(), product({ price: 0 }), newId)).toThrow("Fiyat sıfırdan büyük olmalıdır");
    expect(() => saveProduct(base(), product({ price: 12.5 }), newId)).toThrow("Fiyat sıfırdan büyük olmalıdır");
  });

  it("does not allow the same name twice in one category, but allows it across categories", () => {
    expect(() => saveProduct(base(), product({ name: "çay" }), newId)).toThrow("Bu kategoride aynı adlı ürün var");
    expect(saveProduct(base(), product({ name: "Çay", categoryId: "c2" }), newId).products).toHaveLength(3);
  });

  it("lets a product keep its own name", () => {
    expect(saveProduct(base(), product({ id: "p1", name: "Çay" }), newId).products).toHaveLength(2);
  });
});

describe("deleteProduct", () => {
  it("removes a product", () => {
    expect(deleteProduct(base(), "p1").products.map((entry) => entry.id)).toEqual(["p2"]);
  });

  it("never mutates the state it was given", () => {
    const state = base();
    const snapshot = structuredClone(state);

    deleteProduct(state, "p1");
    saveProduct(state, product(), newId);

    expect(state).toEqual(snapshot);
  });
});
