import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductDefinitionScreen } from "@/features/pos/components/product-definition-screen";
import { PosProvider, type PosSnapshot } from "@/features/pos/store/pos-provider";
import { buildPosSnapshot } from "../../../support/pos-fixtures";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

const router = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));

const actions = vi.hoisted(() => ({
  saveCategoryAction: vi.fn(),
  deleteCategoryAction: vi.fn(),
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

const EMPTY_SNAPSHOT: PosSnapshot = { areas: [], tables: [], categories: [], products: [], orders: [] };

function setup(initial: PosSnapshot = buildPosSnapshot()) {
  render(
    <PosProvider initial={initial}>
      <ProductDefinitionScreen />
    </PosProvider>
  );
  return { user: userEvent.setup() };
}

type Setup = ReturnType<typeof setup>;

const rowOf = (name: string) => screen.getByRole("row", { name: new RegExp(name) });

describe("ProductDefinitionScreen", () => {
  it("lists every product with its category and price, and counts them in the filter tabs", () => {
    setup();

    expect(screen.getByRole("heading", { level: 1, name: "Menü / Ürünler" })).toBeInTheDocument();
    expect(rowOf("Coca Cola")).toHaveTextContent("İçecekler");
    expect(rowOf("Coca Cola")).toHaveTextContent("₺105,00");
    expect(screen.getByRole("tab", { name: /^Tümü\s*3$/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /^Favori Ürünler\s*1$/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /^İçecekler\s*2$/ })).toBeInTheDocument();
  });

  it("filters by category and by favourites", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("tab", { name: /^Tatlılar/ }));
    expect(screen.getByRole("row", { name: /Cheesecake/ })).toBeInTheDocument();
    expect(screen.queryByRole("row", { name: /Coca Cola/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /^Favori Ürünler/ }));
    expect(screen.getByRole("row", { name: /Çay/ })).toBeInTheDocument();
    expect(screen.queryByRole("row", { name: /Cheesecake/ })).not.toBeInTheDocument();
  });

  it("searches by name with Turkish case rules", async () => {
    const { user } = setup();

    await user.type(screen.getByRole("searchbox", { name: "Ürün ara" }), "ÇAY");

    expect(screen.getByRole("row", { name: /Çay/ })).toBeInTheDocument();
    expect(screen.queryByRole("row", { name: /Coca Cola/ })).not.toBeInTheDocument();
  });

  describe("adding and editing", () => {
    // Product creation/editing itself moved to the full-page "Ürün Detay" screen (see
    // product-detail-screen.test.tsx); this screen only has to send the user there.
    it("sends the user to a blank Ürün Detay page for a new product", async () => {
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: "Yeni Ürün" }));

      expect(router.push).toHaveBeenCalledWith("/product-definition/new");
    });

    it("sends the user to the product's own Ürün Detay page to edit it", async () => {
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: "Çay düzenle" }));

      expect(router.push).toHaveBeenCalledWith("/product-definition/p-cay");
    });
  });

  it("deletes a product after confirming", async () => {
    actions.deleteProductAction.mockResolvedValue(undefined);
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Çay sil" }));
    await user.click(await screen.findByRole("button", { name: "Sil" }));

    await waitFor(() => expect(screen.queryByRole("row", { name: /Çay/ })).not.toBeInTheDocument());
    expect(toast.success).toHaveBeenCalledWith("Ürün silindi");
  });

  describe("categories", () => {
    const openCategories = async (user: Setup["user"]) => {
      await user.click(screen.getByRole("button", { name: "Kategoriler" }));
      return within(await screen.findByRole("dialog", { name: "Kategoriler" }));
    };

    it("adds a category", async () => {
      actions.saveCategoryAction.mockResolvedValue({ id: "c3", name: "Salatalar" });
      const { user } = setup();

      const dialog = await openCategories(user);
      await user.type(dialog.getByRole("textbox", { name: "Kategori adı" }), "Salatalar");
      await user.click(dialog.getByRole("button", { name: "Ekle" }));

      await waitFor(() => expect(dialog.getByText("Salatalar")).toBeInTheDocument());
    });

    it("will not delete a category that still has products", async () => {
      actions.deleteCategoryAction.mockRejectedValue(new Error("Kategoride ürün var"));
      const { user } = setup();

      const dialog = await openCategories(user);
      await user.click(dialog.getByRole("button", { name: "İçecekler sil" }));
      await user.click(await screen.findByRole("button", { name: "Sil" }));

      await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Kategoride ürün var"));
      expect(dialog.getByText("İçecekler")).toBeInTheDocument();
    });

    it("deletes an empty category", async () => {
      actions.saveCategoryAction.mockResolvedValue({ id: "c3", name: "Salatalar" });
      actions.deleteCategoryAction.mockResolvedValue(undefined);
      const { user } = setup();
      const dialog = await openCategories(user);
      await user.type(dialog.getByRole("textbox", { name: "Kategori adı" }), "Salatalar");
      await user.click(dialog.getByRole("button", { name: "Ekle" }));
      await waitFor(() => expect(dialog.getByText("Salatalar")).toBeInTheDocument());

      await user.click(dialog.getByRole("button", { name: "Salatalar sil" }));
      await user.click(await screen.findByRole("button", { name: "Sil" }));

      await waitFor(() => expect(dialog.queryByText("Salatalar")).not.toBeInTheDocument());
    });

    it("will not offer a new product while there is no category to put it in", () => {
      setup(EMPTY_SNAPSHOT);

      expect(screen.getByRole("button", { name: "Yeni Ürün" })).toBeDisabled();
    });
  });
});
