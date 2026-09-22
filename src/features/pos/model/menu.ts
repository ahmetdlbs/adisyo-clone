import { isNameTaken, upsertById } from "@/lib/collection";
import type { Kurus } from "@/lib/money";
import type { Category, PosState, Product } from "./pos-state";

// ── Categories ──────────────────────────────────────────────────────────────

export function saveCategory(state: PosState, input: { id: string | null; name: string }, newId: () => string): PosState {
  const name = input.name.trim();
  if (name === "") throw new Error("Kategori adı zorunludur");
  if (isNameTaken(state.categories, name, input.id)) throw new Error("Bu kategori zaten tanımlı");
  if (input.id !== null && !state.categories.some((category) => category.id === input.id)) throw new Error("Kategori bulunamadı");

  const category: Category = { id: input.id ?? newId(), name };
  return { ...state, categories: upsertById(state.categories, category) };
}

/** Removes an empty category. Products must be moved or deleted first, so none is left without one. */
export function deleteCategory(state: PosState, categoryId: string): PosState {
  if (state.products.some((product) => product.categoryId === categoryId)) throw new Error("Kategoride ürün var");
  return { ...state, categories: state.categories.filter((category) => category.id !== categoryId) };
}

// ── Products ────────────────────────────────────────────────────────────────

export interface ProductInput {
  id: string | null;
  name: string;
  categoryId: string;
  price: Kurus;
  barcode?: string;
  isFavorite: boolean;
}

export function saveProduct(state: PosState, input: ProductInput, newId: () => string): PosState {
  const name = input.name.trim();
  if (name === "") throw new Error("Ürün adı zorunludur");
  if (!state.categories.some((category) => category.id === input.categoryId)) throw new Error("Kategori bulunamadı");
  if (!Number.isInteger(input.price) || input.price <= 0) throw new Error("Fiyat sıfırdan büyük olmalıdır");
  if (input.id !== null && !state.products.some((product) => product.id === input.id)) throw new Error("Ürün bulunamadı");

  const sameCategory = state.products.filter((product) => product.categoryId === input.categoryId);
  if (isNameTaken(sameCategory, name, input.id)) throw new Error("Bu kategoride aynı adlı ürün var");

  const barcode = input.barcode?.trim();
  const product: Product = {
    id: input.id ?? newId(),
    name,
    categoryId: input.categoryId,
    price: input.price,
    ...(barcode ? { barcode } : {}),
    isFavorite: input.isFavorite,
  };
  return { ...state, products: upsertById(state.products, product) };
}

/** Removes a product from the menu. Open bills keep their lines: they carry the name and price they were added with. */
export function deleteProduct(state: PosState, productId: string): PosState {
  return { ...state, products: state.products.filter((product) => product.id !== productId) };
}
