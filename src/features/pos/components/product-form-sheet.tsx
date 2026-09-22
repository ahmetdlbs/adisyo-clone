"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormSheet } from "@/components/kit/form-sheet";
import { SelectField, SwitchField, TextField } from "@/components/kit/form-fields";
import { productFormSchema, type ProductFormInput, type ProductFormValues } from "../model/definition-forms";
import { toAmountText } from "@/lib/money";
import type { Category, Product } from "../model/pos-state";

interface ProductFormSheetProps {
  open: boolean;
  /** The product being edited, or null when creating. */
  product: Product | null;
  categories: readonly Category[];
  /** The category to preselect for a new product. */
  defaultCategoryId: string;
  onOpenChange: (open: boolean) => void;
  /** Throw an Error to reject the product; its message is shown on the name field. */
  onSave: (values: ProductFormValues) => void;
}

/** Mount with a new `key` per opening so the form starts from this product's values. */
export function ProductFormSheet({ open, product, categories, defaultCategoryId, onOpenChange, onSave }: ProductFormSheetProps) {
  const form = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      categoryId: product?.categoryId ?? defaultCategoryId,
      price: product ? toAmountText(product.price) : "",
      barcode: product?.barcode ?? "",
      isFavorite: product?.isFavorite ?? false,
    },
  });

  const submit = form.handleSubmit((values) => {
    try {
      onSave(values);
    } catch (error) {
      form.setError("name", { message: error instanceof Error ? error.message : "Kaydedilemedi" });
    }
  });

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Ürün Detay"
      description={product ? "Ürün bilgilerini güncelleyiniz." : "Yeni ürün bilgilerini giriniz."}
      submitLabel={product ? "Güncelle" : "Kaydet"}
      onSubmit={submit}
    >
      <TextField control={form.control} name="name" label="Ürün Adı" required autoFocus />
      <SelectField control={form.control} name="categoryId" label="Kategori" options={categories.map((category) => ({ value: category.id, label: category.name }))} />
      <TextField control={form.control} name="price" label="Fiyat (₺)" inputMode="decimal" placeholder="0,00" required />
      <TextField control={form.control} name="barcode" label="Ürün Kodu / Barkod" description="Kasada barkod okutarak arama yapabilmek için." />
      <SwitchField control={form.control} name="isFavorite" label="Favori Ürün" description="Sipariş ekranında ilk sekmede görünür." />
    </FormSheet>
  );
}
