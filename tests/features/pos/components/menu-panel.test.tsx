import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuPanel } from "@/features/pos/components/menu-panel";
import type { Order } from "@/features/pos/model/order";
import type { Category, Product } from "@/features/pos/model/pos-state";

const ORDER: Order = {
  id: "o1",
  number: 1,
  type: "table",
  tableId: "t1",
  waiter: "Ahmet",
  openedAt: new Date().toISOString(),
  stage: "preparing",
  status: "open",
  closedAt: null,
  lines: [],
  discountPercent: 0,
  payments: [],
};

const CATEGORIES: Category[] = [{ id: "c1", name: "İçecekler" }];

const SIMPLE_PRODUCT: Product = {
  id: "p-cay",
  name: "Çay",
  categoryId: "c1",
  isFavorite: true,
  showOnSalesScreen: true,
  showOnKitchenScreen: true,
  vatExcluded: false,
  autoAskFeaturePortion: false,
  useRecipe: false,
  trackStock: false,
  isCombo: false,
  portions: [{ id: "po-cay", name: "Tam", isDefault: true, tablePrice: 5200, takeawayPrice: 5200, deliveryPrice: 5200, recipeLines: [] }],
  featureGroupIds: [],
  comboItems: [],
};

const MULTI_PORTION_PRODUCT: Product = {
  id: "p-cola",
  name: "Cola",
  categoryId: "c1",
  isFavorite: true,
  showOnSalesScreen: true,
  showOnKitchenScreen: true,
  vatExcluded: false,
  autoAskFeaturePortion: false,
  useRecipe: false,
  trackStock: false,
  isCombo: false,
  portions: [
    { id: "po-tam", name: "Tam", isDefault: true, tablePrice: 10000, takeawayPrice: 9500, deliveryPrice: 10500, recipeLines: [] },
    { id: "po-yarim", name: "Yarım", isDefault: false, tablePrice: 6000, takeawayPrice: 5500, deliveryPrice: 6500, recipeLines: [] },
  ],
  featureGroupIds: [],
  comboItems: [],
};

function setup(products: Product[], order: Order = ORDER) {
  const onAdd = vi.fn();
  const onDecrement = vi.fn();
  render(
    <MenuPanel products={products} categories={CATEGORIES} order={order} query="" onAdd={onAdd} onDecrement={onDecrement} />
  );
  return { onAdd, onDecrement, user: userEvent.setup() };
}

describe("MenuPanel", () => {
  it("adds a single-portion product's only portion directly on tap", async () => {
    const { onAdd, user } = setup([SIMPLE_PRODUCT]);

    await user.click(screen.getByRole("button", { name: "Çay ekle" }));

    expect(onAdd).toHaveBeenCalledWith(SIMPLE_PRODUCT, "po-cay");
  });

  it("shows the default portion's price for the order's channel", () => {
    setup([MULTI_PORTION_PRODUCT], { ...ORDER, type: "takeaway" });

    expect(screen.getByText("₺95,00")).toBeInTheDocument();
  });

  it("opens a portion picker for a product with more than one portion, instead of adding straight away", async () => {
    const { onAdd, user } = setup([MULTI_PORTION_PRODUCT]);

    await user.click(screen.getByRole("button", { name: "Cola ekle" }));

    expect(onAdd).not.toHaveBeenCalled();
    const picker = await screen.findByRole("dialog", { name: "Cola porsiyon seç" });
    expect(picker).toHaveTextContent("Tam");
    expect(picker).toHaveTextContent("Yarım");
  });

  it("adds the chosen portion and closes the picker", async () => {
    const { onAdd, user } = setup([MULTI_PORTION_PRODUCT]);

    await user.click(screen.getByRole("button", { name: "Cola ekle" }));
    const picker = await screen.findByRole("dialog", { name: "Cola porsiyon seç" });
    await user.click(within(picker).getByText("Yarım"));

    expect(onAdd).toHaveBeenCalledWith(MULTI_PORTION_PRODUCT, "po-yarim");
  });

  it("increments and decrements the default portion from the quantity badge, once something is on the order", async () => {
    const order: Order = {
      ...ORDER,
      lines: [{ id: "l1", productId: "p-cay", portionId: "po-cay", name: "Çay", unitPrice: 5200, quantity: 2, isComplimentary: false }],
    };
    const { onAdd, onDecrement, user } = setup([SIMPLE_PRODUCT], order);

    expect(screen.getByText("2")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Çay arttır" }));
    await user.click(screen.getByRole("button", { name: "Çay azalt" }));

    expect(onAdd).toHaveBeenCalledWith(SIMPLE_PRODUCT, "po-cay");
    expect(onDecrement).toHaveBeenCalledWith(SIMPLE_PRODUCT, "po-cay");
  });
});
