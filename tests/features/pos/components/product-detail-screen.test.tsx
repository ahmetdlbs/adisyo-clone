import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductDetailScreen } from "@/features/pos/components/product-detail-screen";
import type { Product } from "@/features/pos/model/pos-state";
import { PosProvider, type PosSnapshot } from "@/features/pos/store/pos-provider";
import { buildPosSnapshot, productFixture } from "../../../support/pos-fixtures";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

const router = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));

const actions = vi.hoisted(() => ({
  saveCategoryAction: vi.fn(),
  deleteCategoryAction: vi.fn(),
  fetchCategories: vi.fn(),
  fetchProducts: vi.fn(),
  saveProductAction: vi.fn(),
  deleteProductAction: vi.fn(),
}));
vi.mock("@/features/pos/server/menu-actions", () => actions);

beforeEach(() => {
  toast.success.mockClear();
  toast.error.mockClear();
  router.push.mockClear();
  Object.values(actions).forEach((mock) => mock.mockReset());
});

const VAT_DEFINITIONS = [{ id: "v1", name: "Genel", rate: 10, isDefault: true }];
const KITCHEN_GROUPS = [{ id: "k1", name: "Mutfak", hasCookingStage: false, hasPackagingStage: false }];
const COURSE_GROUPS = [{ id: "g1", name: "Ana Yemek" }];
const UNITS = [{ id: "u1", name: "Adet" }];
const FEATURE_GROUPS = [
  { id: "fg1", name: "Şeker Oranı", selectionType: "single" as const, useRecipeProduct: false, isRequired: false, options: [] },
];
const STOCK_ITEMS = [{ id: "s1", name: "Dana Kıyma", unitId: "u1", unitName: "Adet", quantity: 10 }];

function setup(productId: string, initial: PosSnapshot = buildPosSnapshot()) {
  render(
    <PosProvider initial={initial}>
      <ProductDetailScreen
        productId={productId}
        vatDefinitions={VAT_DEFINITIONS}
        kitchenGroups={KITCHEN_GROUPS}
        courseGroups={COURSE_GROUPS}
        units={UNITS}
        featureGroups={FEATURE_GROUPS}
        stockItems={STOCK_ITEMS}
      />
    </PosProvider>
  );
  return { user: userEvent.setup() };
}

const savedProduct = (overrides: Partial<Product> = {}): Product => ({ ...productFixture("p-new", "Limonata", "c1", 7550), ...overrides });

describe("ProductDetailScreen", () => {
  it("shows an unknown product as not found, with a way back to the list", async () => {
    const { user } = setup("does-not-exist");

    expect(screen.getByText("Ürün bulunamadı.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Ürün listesine dön" }));

    expect(router.push).toHaveBeenCalledWith("/product-definition");
  });

  describe("creating a product", () => {
    it("starts from a blank form with one default 'Tam' portion, and offers Kaydet, not Güncelle", () => {
      setup("new");

      expect(screen.getByRole("heading", { level: 1, name: "Ürün Detay" })).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: /Ürün Adı/ })).toHaveValue("");
      expect(screen.getByRole("textbox", { name: /Porsiyon adı 1/ })).toHaveValue("Tam");
      expect(screen.getByRole("button", { name: "Kaydet" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Ürünü Sil" })).not.toBeInTheDocument();
    });

    it("requires a name and a valid portion price before it will save", async () => {
      const { user } = setup("new");

      await user.click(screen.getByRole("button", { name: "Kaydet" }));

      expect(await screen.findByText("Ürün adı zorunludur")).toBeInTheDocument();
      expect(screen.getAllByText("Geçerli bir tutar giriniz").length).toBeGreaterThan(0);
      expect(actions.saveProductAction).not.toHaveBeenCalled();
    });

    it("saves a new product and returns to the list", async () => {
      actions.saveProductAction.mockResolvedValue(savedProduct());
      const { user } = setup("new");

      await user.type(screen.getByRole("textbox", { name: /Ürün Adı/ }), "Limonata");
      await user.type(screen.getByRole("textbox", { name: "Masa siparişi fiyatı 1" }), "75,50");
      await user.type(screen.getByRole("textbox", { name: "Gel al sipariş fiyatı 1" }), "75,50");
      await user.type(screen.getByRole("textbox", { name: "Paket sipariş fiyatı 1" }), "75,50");
      await user.click(screen.getByRole("button", { name: "Kaydet" }));

      await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Ürün eklendi"));
      expect(actions.saveProductAction).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          name: "Limonata",
          categoryId: "c1",
          portions: [expect.objectContaining({ name: "Tam", isDefault: true, tablePrice: 7550, takeawayPrice: 7550, deliveryPrice: 7550 })],
        })
      );
      expect(router.push).toHaveBeenCalledWith("/product-definition");
    });

    it("adds a second portion and lets it become the default", async () => {
      const { user } = setup("new");

      await user.click(screen.getByRole("button", { name: "Porsiyon Ekle" }));
      expect(screen.getByRole("textbox", { name: /Porsiyon adı 2/ })).toBeInTheDocument();

      await user.click(screen.getByRole("checkbox", { name: "Varsayılan porsiyon 2" }));

      expect(screen.getByRole("checkbox", { name: "Varsayılan porsiyon 1" })).not.toBeChecked();
      expect(screen.getByRole("checkbox", { name: "Varsayılan porsiyon 2" })).toBeChecked();
    });

    it("selects a feature group and includes it in the saved product", async () => {
      actions.saveProductAction.mockResolvedValue(savedProduct());
      const { user } = setup("new");

      await user.type(screen.getByRole("textbox", { name: /Ürün Adı/ }), "Limonata");
      for (const label of ["Masa siparişi fiyatı 1", "Gel al sipariş fiyatı 1", "Paket sipariş fiyatı 1"]) {
        await user.type(screen.getByRole("textbox", { name: label }), "10");
      }
      await user.click(screen.getByRole("checkbox", { name: "Şeker Oranı" }));
      await user.click(screen.getByRole("button", { name: "Kaydet" }));

      await waitFor(() => expect(actions.saveProductAction).toHaveBeenCalled());
      expect(actions.saveProductAction).toHaveBeenCalledWith(null, expect.objectContaining({ featureGroupIds: ["fg1"] }));
    });

    it("adds a recipe line once 'Reçeteli ürün kullan' is on, and saves it with the product", async () => {
      actions.saveProductAction.mockResolvedValue(savedProduct());
      const { user } = setup("new");

      await user.click(screen.getByRole("switch", { name: "Reçeteli ürün kullan" }));
      await user.click(screen.getByRole("button", { name: "Malzeme Ekle" }));
      await user.click(screen.getByRole("combobox", { name: "Malzeme 1" }));
      await user.click(await screen.findByRole("option", { name: "Dana Kıyma (Adet)" }));
      await user.type(screen.getByRole("textbox", { name: "Malzeme 1 miktarı" }), "0,2");

      await user.type(screen.getByRole("textbox", { name: /Ürün Adı/ }), "Köfte");
      for (const label of ["Masa siparişi fiyatı 1", "Gel al sipariş fiyatı 1", "Paket sipariş fiyatı 1"]) {
        await user.type(screen.getByRole("textbox", { name: label }), "10");
      }
      await user.click(screen.getByRole("button", { name: "Kaydet" }));

      await waitFor(() => expect(actions.saveProductAction).toHaveBeenCalled());
      expect(actions.saveProductAction).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          useRecipe: true,
          portions: [
            expect.objectContaining({
              recipeLines: [expect.objectContaining({ stockItemId: "s1", quantity: 0.2 })],
            }),
          ],
        })
      );
    });

    it("maps a single stock card to the portion once 'Stok takibi yap' is on", async () => {
      actions.saveProductAction.mockResolvedValue(savedProduct());
      const { user } = setup("new");

      await user.click(screen.getByRole("switch", { name: "Stok takibi yap" }));
      await user.click(screen.getByRole("combobox", { name: "Stok kartı 1" }));
      await user.click(await screen.findByRole("option", { name: "Dana Kıyma" }));

      await user.type(screen.getByRole("textbox", { name: /Ürün Adı/ }), "Kıyma Paketi");
      for (const label of ["Masa siparişi fiyatı 1", "Gel al sipariş fiyatı 1", "Paket sipariş fiyatı 1"]) {
        await user.type(screen.getByRole("textbox", { name: label }), "10");
      }
      await user.click(screen.getByRole("button", { name: "Kaydet" }));

      await waitFor(() => expect(actions.saveProductAction).toHaveBeenCalled());
      expect(actions.saveProductAction).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          trackStock: true,
          portions: [
            expect.objectContaining({
              recipeLines: [expect.objectContaining({ stockItemId: "s1", quantity: 1 })],
            }),
          ],
        })
      );
    });

    it("requires at least one item once 'Menü Tanımla' is on, then saves the chosen product+portion", async () => {
      actions.saveProductAction.mockResolvedValue(savedProduct());
      const { user } = setup("new");

      await user.click(screen.getByRole("switch", { name: "Menü Tanımla" }));
      await user.type(screen.getByRole("textbox", { name: /Ürün Adı/ }), "Menü 1");
      for (const label of ["Masa siparişi fiyatı 1", "Gel al sipariş fiyatı 1", "Paket sipariş fiyatı 1"]) {
        await user.type(screen.getByRole("textbox", { name: label }), "10");
      }
      await user.click(screen.getByRole("button", { name: "Kaydet" }));

      expect(await screen.findByText("Menüye en az bir ürün ekleyin")).toBeInTheDocument();
      expect(actions.saveProductAction).not.toHaveBeenCalled();

      await user.click(screen.getByRole("button", { name: "Ürün Ekle" }));
      await user.click(screen.getByRole("combobox", { name: "Ürün 1" }));
      await user.click(await screen.findByRole("option", { name: "Çay" }));
      await user.click(screen.getByRole("button", { name: "Kaydet" }));

      await waitFor(() => expect(actions.saveProductAction).toHaveBeenCalled());
      expect(actions.saveProductAction).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          isCombo: true,
          comboItems: [expect.objectContaining({ productId: "p-cay", portionId: "po-cay", quantity: 1 })],
        })
      );
    });
  });

  describe("editing a product", () => {
    it("prefills the form from the existing product and offers Güncelle plus Ürünü Sil", () => {
      setup("p-cay");

      expect(screen.getByRole("textbox", { name: /Ürün Adı/ })).toHaveValue("Çay");
      expect(screen.getByRole("textbox", { name: "Masa siparişi fiyatı 1" })).toHaveValue("52");
      expect(screen.getByRole("button", { name: "Güncelle" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Ürünü Sil" })).toBeInTheDocument();
    });

    it("deletes the product after confirming, and returns to the list", async () => {
      actions.deleteProductAction.mockResolvedValue(undefined);
      const { user } = setup("p-cay");

      await user.click(screen.getByRole("button", { name: "Ürünü Sil" }));
      await user.click(await screen.findByRole("button", { name: "Sil" }));

      await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Ürün silindi"));
      expect(router.push).toHaveBeenCalledWith("/product-definition");
    });

    it("shows the API's reason on the name field when saving is rejected", async () => {
      actions.saveProductAction.mockRejectedValue(new Error("Bu kategoride aynı adlı ürün var"));
      const { user } = setup("p-cay");

      await user.click(screen.getByRole("button", { name: "Güncelle" }));

      expect(await screen.findByText("Bu kategoride aynı adlı ürün var")).toBeInTheDocument();
      expect(router.push).not.toHaveBeenCalled();
    });
  });
});
