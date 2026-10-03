"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { filterByQuery } from "@/lib/search";
import { formatKurus } from "@/lib/money";
import { quantityOf, type Order } from "../model/order";
import { defaultPortion, portionPrice, type Category, type Product } from "../model/pos-state";

const FAVORITES = "favorites";

interface MenuPanelProps {
  products: readonly Product[];
  categories: readonly Category[];
  order: Order;
  /** Text typed into the search box; when set it searches every category. */
  query: string;
  onAdd: (product: Product, portionId: string) => void;
  onDecrement: (product: Product, portionId: string) => void;
}

/** The menu: category tabs and the grid of products to tap onto the bill. */
export function MenuPanel({ products, categories, order, query, onAdd, onDecrement }: MenuPanelProps) {
  const [selectedTab, setSelectedTab] = useState(FAVORITES);
  const tab = selectedTab === FAVORITES || categories.some((category) => category.id === selectedTab) ? selectedTab : FAVORITES;

  const visible =
    query.trim() !== ""
      ? filterByQuery(products, query, (product) => product.name)
      : tab === FAVORITES
        ? products.filter((product) => product.isFavorite)
        : products.filter((product) => product.categoryId === tab);

  return (
    <section aria-label="Menü" className="flex min-w-0 flex-1 flex-col bg-muted/60">
      <Tabs value={query.trim() !== "" ? "" : tab} onValueChange={(value) => setSelectedTab(String(value))} className="overflow-x-auto border-b bg-card px-2">
        <TabsList variant="line" className="h-11">
          <TabsTrigger value={FAVORITES} className="px-4 text-xs font-bold">
            FAVORİ ÜRÜNLER
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="px-4 text-xs font-bold">
              {category.name.toLocaleUpperCase("tr")}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid flex-1 grid-cols-2 content-start gap-2 overflow-y-auto p-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {visible.length === 0 && <p className="col-span-full p-6 text-center text-sm text-muted-foreground">Ürün bulunamadı.</p>}
        {visible.map((product) => (
          <ProductTile key={product.id} product={product} order={order} onAdd={onAdd} onDecrement={onDecrement} />
        ))}
      </div>
    </section>
  );
}

interface ProductTileProps {
  product: Product;
  order: Order;
  onAdd: (product: Product, portionId: string) => void;
  onDecrement: (product: Product, portionId: string) => void;
}

/**
 * A product with one portion adds/removes it directly; a product with several (e.g. "Tam"/"Yarım") opens a
 * picker on tap, but the quick +/- and the quantity badge still track only the default portion — the fast
 * path for the common single-portion case, matching the real POS's tile behaviour.
 */
function ProductTile({ product, order, onAdd, onDecrement }: ProductTileProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const portion = defaultPortion(product);
  if (!portion) return null;

  const hasChoices = product.portions.length > 1;
  const quantity = quantityOf(order, product.id, portion.id);

  const mainButton = (
    <button
      type="button"
      aria-label={`${product.name} ekle`}
      onClick={hasChoices ? undefined : () => onAdd(product, portion.id)}
      className="flex min-w-0 flex-1 cursor-pointer flex-col justify-between p-2.5 text-left hover:bg-accent"
    >
      <span className="line-clamp-2 text-[13px] leading-snug font-medium">{product.name}</span>
      <span className="text-xs text-muted-foreground">{formatKurus(portionPrice(portion, order.type))}</span>
    </button>
  );

  return (
    <div role="group" aria-label={product.name} className="flex h-20 overflow-hidden rounded-md border bg-card shadow-2xs">
      {hasChoices ? (
        <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
          <PopoverTrigger render={mainButton} />
          <PopoverContent aria-label={`${product.name} porsiyon seç`} className="w-56">
            {product.portions.map((choice) => (
              <button
                key={choice.id}
                type="button"
                onClick={() => {
                  onAdd(product, choice.id);
                  setIsPickerOpen(false);
                }}
                className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
              >
                <span>{choice.name}</span>
                <span className="text-muted-foreground">{formatKurus(portionPrice(choice, order.type))}</span>
              </button>
            ))}
          </PopoverContent>
        </Popover>
      ) : (
        mainButton
      )}
      {quantity > 0 && (
        <div className="flex w-9 shrink-0 flex-col border-l">
          <button
            type="button"
            aria-label={`${product.name} arttır`}
            onClick={() => onAdd(product, portion.id)}
            className="flex flex-1 cursor-pointer items-center justify-center text-primary hover:bg-accent"
          >
            <Plus className="size-3.5" />
          </button>
          <span className="flex h-7 items-center justify-center bg-primary text-[13px] font-bold text-primary-foreground">{quantity}</span>
          <button
            type="button"
            aria-label={`${product.name} azalt`}
            onClick={() => onDecrement(product, portion.id)}
            className="flex flex-1 cursor-pointer items-center justify-center text-primary hover:bg-accent"
          >
            <Minus className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
