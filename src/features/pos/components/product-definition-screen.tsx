"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Star, Tags, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { PageBody, PageCard, PageContainer, PageToolbar } from "@/components/kit/page";
import { PageHeader } from "@/components/kit/page-header";
import { RowActions } from "@/components/kit/row-actions";
import { SearchInput } from "@/components/kit/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES } from "@/config/routes";
import { filterByQuery } from "@/lib/search";
import { formatKurus } from "@/lib/money";
import { categoryFormSchema } from "../model/definition-forms";
import { defaultPortion, portionPrice, type Product } from "../model/pos-state";
import { usePosActions, usePosState } from "../store/pos-provider";
import { ManageListDialog } from "./manage-list-dialog";

const ALL = "all";
const FAVORITES = "favorites";

/** Menu editor: the products the POS sells, their categories and prices. Feeds the order screen directly. */
export function ProductDefinitionScreen() {
  const state = usePosState();
  const actions = usePosActions();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(ALL);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const filter = selectedFilter === ALL || selectedFilter === FAVORITES || state.categories.some((category) => category.id === selectedFilter) ? selectedFilter : ALL;
  const categoryName = (categoryId: string) => state.categories.find((category) => category.id === categoryId)?.name ?? "—";

  const inFilter = (product: Product) =>
    filter === ALL || (filter === FAVORITES ? product.isFavorite : product.categoryId === filter);
  const rows = filterByQuery(state.products.filter(inFilter), query, (product) => `${product.name} ${product.barcode ?? ""}`);

  const removeProduct = async (product: Product) => {
    try {
      await actions.deleteProduct(product.id);
      toast.success("Ürün silindi");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ürün silinemedi");
    }
  };

  const columns: readonly DataTableColumn<Product>[] = [
    {
      id: "name",
      header: "Ürün Adı",
      cell: (product) => (
        <span className="flex items-center gap-2">
          {product.name}
          {product.isFavorite && <Star aria-label="Favori" className="size-3.5 fill-warning text-warning" />}
        </span>
      ),
    },
    { id: "category", header: "Kategori", cell: (product) => categoryName(product.categoryId) },
    {
      id: "price",
      header: "Fiyat",
      align: "right",
      cell: (product) => {
        const portion = defaultPortion(product);
        if (!portion) return "—";
        return (
          <span>
            {formatKurus(portionPrice(portion, "table"))}
            {product.portions.length > 1 && (
              <span className="ml-1 text-xs text-muted-foreground">(+{product.portions.length - 1} porsiyon)</span>
            )}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "İşlemler",
      align: "right",
      cell: (product) => (
        <RowActions name={product.name} onEdit={() => router.push(`${ROUTES.productDefinition}/${product.id}`)} onDelete={() => removeProduct(product)} />
      ),
    },
  ];

  const countIn = (test: (product: Product) => boolean) => state.products.filter(test).length;

  return (
    <PageContainer className="max-w-7xl">
      <PageCard>
        <PageHeader
          className="p-6"
          icon={UtensilsCrossed}
          title="Menü / Ürünler"
          description="Satış ekranında görünen ürünleri, kategorilerini ve fiyatlarını buradan yönetebilirsiniz. Yaptığınız değişiklikler sipariş ekranına anında yansır."
          actions={
            <>
              <Button variant="ghost" className="text-primary" onClick={() => setIsCategoriesOpen(true)}>
                <Tags />
                Kategoriler
              </Button>
              <Button disabled={state.categories.length === 0} onClick={() => router.push(`${ROUTES.productDefinition}/new`)}>
                <Plus />
                Yeni Ürün
              </Button>
            </>
          }
        />
        <PageToolbar className="flex-wrap">
          <SearchInput className="w-80" value={query} onValueChange={setQuery} placeholder="Ürün adı veya barkod ile ara" aria-label="Ürün ara" />
          <Tabs value={filter} onValueChange={(value) => setSelectedFilter(String(value))}>
            <TabsList variant="line" className="h-9">
              <FilterTab value={ALL} label="Tümü" count={state.products.length} />
              <FilterTab value={FAVORITES} label="Favori Ürünler" count={countIn((product) => product.isFavorite)} />
              {state.categories.map((category) => (
                <FilterTab key={category.id} value={category.id} label={category.name} count={countIn((product) => product.categoryId === category.id)} />
              ))}
            </TabsList>
          </Tabs>
        </PageToolbar>
        <PageBody className="pt-4">
          <DataTable columns={columns} rows={rows} getRowId={(product) => product.id} caption="Ürünler" emptyMessage="Ürün bulunamadı." />
        </PageBody>
      </PageCard>

      <ManageListDialog
        open={isCategoriesOpen}
        onOpenChange={setIsCategoriesOpen}
        title="Kategoriler"
        description="Kategori ekleyin, adını değiştirin veya boş bir kategoriyi silin."
        noun="Kategori"
        schema={categoryFormSchema}
        items={state.categories}
        onSave={async ({ id, name }) => {
          await actions.saveCategory(id, name);
          toast.success(id ? "Kategori güncellendi" : "Kategori eklendi");
        }}
        onDelete={async (id) => {
          await actions.deleteCategory(id);
          toast.success("Kategori silindi");
        }}
      />
    </PageContainer>
  );
}

function FilterTab({ value, label, count }: { value: string; label: string; count: number }) {
  return (
    <TabsTrigger value={value}>
      {label}
      <Badge variant="secondary">{count}</Badge>
    </TabsTrigger>
  );
}
