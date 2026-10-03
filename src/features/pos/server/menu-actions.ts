"use server";

import { ApiError, apiFetch } from "@/lib/api-client";
import type { ProductFormValues } from "../model/definition-forms";
import type { Category, Product } from "../model/pos-state";
import { toCategory, toProduct } from "./adapt";
import type { ApiCategory, ApiProduct } from "./wire-types";

function asError(error: unknown, fallback: string): Error {
  return error instanceof ApiError ? new Error(error.message) : new Error(fallback);
}

// ── Categories ────────────────────────────────────────────────────────────

export async function fetchCategories(): Promise<Category[]> {
  const categories = await apiFetch<ApiCategory[]>("/categories");
  return categories.map(toCategory);
}

export async function saveCategoryAction(id: string | null, name: string): Promise<Category> {
  try {
    const category = id
      ? await apiFetch<ApiCategory>(`/categories/${id}`, { method: "PATCH", body: { name } })
      : await apiFetch<ApiCategory>("/categories", { method: "POST", body: { name } });
    return toCategory(category);
  } catch (error) {
    throw asError(error, "Kategori kaydedilemedi");
  }
}

export async function deleteCategoryAction(id: string): Promise<void> {
  try {
    await apiFetch(`/categories/${id}`, { method: "DELETE" });
  } catch (error) {
    throw asError(error, "Kategori silinemedi");
  }
}

// ── Products ──────────────────────────────────────────────────────────────

export async function fetchProducts(): Promise<Product[]> {
  const products = await apiFetch<ApiProduct[]>("/products");
  return products.map(toProduct);
}

export async function saveProductAction(id: string | null, values: ProductFormValues): Promise<Product> {
  try {
    const product = id
      ? await apiFetch<ApiProduct>(`/products/${id}`, { method: "PATCH", body: values })
      : await apiFetch<ApiProduct>("/products", { method: "POST", body: values });
    return toProduct(product);
  } catch (error) {
    throw asError(error, "Ürün kaydedilemedi");
  }
}

export async function deleteProductAction(id: string): Promise<void> {
  try {
    await apiFetch(`/products/${id}`, { method: "DELETE" });
  } catch (error) {
    throw asError(error, "Ürün silinemedi");
  }
}
