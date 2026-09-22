import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductDefinitionScreen } from "@/features/pos/components/product-definition-screen";
import { createEmptyPosState, type PosState } from "@/features/pos/model/pos-state";
import { createPosStore, PosProvider } from "@/features/pos/store/pos-provider";
import { buildPosState } from "../../../support/pos-fixtures";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

beforeEach(() => {
  toast.success.mockClear();
  toast.error.mockClear();
});

function setup(initial: PosState = buildPosState()) {
  const store = createPosStore({ initial, storage: null });
  render(
    <PosProvider store={store}>
      <ProductDefinitionScreen />
    </PosProvider>
  );
  return { store, user: userEvent.setup() };
}

type Setup = ReturnType<typeof setup>;

const rowOf = (name: string) => screen.getByRole("row", { name: new RegExp(name) });
const productNames = (store: Setup["store"]) => store.getState().products.map((product) => product.name);

async function fillProduct(user: Setup["user"], { name, price }: { name?: string; price?: string }) {
  const sheet = within(await screen.findByRole("dialog", { name: "Ürün Detay" }));
  if (name !== undefined) await user.type(sheet.getByRole("textbox", { name: /Ürün Adı/ }), name);
  if (price !== undefined) await user.type(sheet.getByRole("textbox", { name: /Fiyat/ }), price);
  return sheet;
}

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
    it("adds a product; the price is typed in lira and stored as whole kuruş", async () => {
      const { user, store } = setup();

      await user.click(screen.getByRole("button", { name: "Yeni Ürün" }));
      const sheet = await fillProduct(user, { name: "Limonata", price: "75,50" });
      await user.click(sheet.getByRole("button", { name: "Kaydet" }));

      await waitFor(() => expect(productNames(store)).toContain("Limonata"));
      expect(store.getState().products.find((product) => product.name === "Limonata")).toMatchObject({ price: 7550, categoryId: "c1", isFavorite: false });
      expect(rowOf("Limonata")).toHaveTextContent("₺75,50");
      expect(toast.success).toHaveBeenCalledWith("Ürün eklendi");
    });

    it("says what is missing when the form is empty", async () => {
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: "Yeni Ürün" }));
      await user.click(within(await screen.findByRole("dialog", { name: "Ürün Detay" })).getByRole("button", { name: "Kaydet" }));

      expect(await screen.findByText("Ürün adı zorunludur")).toBeInTheDocument();
      expect(screen.getByText("Geçerli bir fiyat giriniz")).toBeInTheDocument();
    });

    it("rejects a price that is not a valid amount", async () => {
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: "Yeni Ürün" }));
      const sheet = await fillProduct(user, { name: "Limonata", price: "12,345" });
      await user.click(sheet.getByRole("button", { name: "Kaydet" }));

      expect(await screen.findByText("Geçerli bir fiyat giriniz")).toBeInTheDocument();
    });

    it("shows the model's reason on the field when the name repeats in a category", async () => {
      const { user, store } = setup();

      await user.click(screen.getByRole("button", { name: "Yeni Ürün" }));
      const sheet = await fillProduct(user, { name: "çay", price: "10" });
      await user.click(sheet.getByRole("button", { name: "Kaydet" }));

      expect(await screen.findByText("Bu kategoride aynı adlı ürün var")).toBeInTheDocument();
      expect(store.getState().products).toHaveLength(3);
    });

    it("edits a product with its price prefilled the way it is typed", async () => {
      const { user, store } = setup();

      await user.click(screen.getByRole("button", { name: "Çay düzenle" }));
      const sheet = within(await screen.findByRole("dialog", { name: "Ürün Detay" }));
      const price = sheet.getByRole("textbox", { name: /Fiyat/ });
      expect(price).toHaveValue("52");
      await user.clear(price);
      await user.type(price, "55,5");
      await user.click(sheet.getByRole("button", { name: "Güncelle" }));

      await waitFor(() => expect(store.getState().products.find((product) => product.id === "p-cay")?.price).toBe(5550));
      expect(toast.success).toHaveBeenCalledWith("Ürün güncellendi");
    });

    it("can take a product off the favourites", async () => {
      const { user, store } = setup();

      await user.click(screen.getByRole("button", { name: "Çay düzenle" }));
      const sheet = within(await screen.findByRole("dialog", { name: "Ürün Detay" }));
      await user.click(sheet.getByRole("switch", { name: "Favori Ürün" }));
      await user.click(sheet.getByRole("button", { name: "Güncelle" }));

      await waitFor(() => expect(store.getState().products.find((product) => product.id === "p-cay")?.isFavorite).toBe(false));
      expect(screen.getByRole("tab", { name: /^Favori Ürünler\s*0$/ })).toBeInTheDocument();
    });
  });

  it("deletes a product after confirming, without touching a bill that already has it", async () => {
    const { user, store } = setup();

    await user.click(screen.getByRole("button", { name: "Çay sil" }));
    await user.click(await screen.findByRole("button", { name: "Sil" }));

    await waitFor(() => expect(productNames(store)).not.toContain("Çay"));
    expect(store.getState().orders[0]?.lines.map((line) => line.name)).toContain("Çay");
  });

  describe("categories", () => {
    const openCategories = async (user: Setup["user"]) => {
      await user.click(screen.getByRole("button", { name: "Kategoriler" }));
      return within(await screen.findByRole("dialog", { name: "Kategoriler" }));
    };

    it("adds a category", async () => {
      const { user, store } = setup();

      const dialog = await openCategories(user);
      await user.type(dialog.getByRole("textbox", { name: "Kategori adı" }), "Salatalar");
      await user.click(dialog.getByRole("button", { name: "Ekle" }));

      await waitFor(() => expect(store.getState().categories.map((category) => category.name)).toContain("Salatalar"));
    });

    it("will not delete a category that still has products", async () => {
      const { user, store } = setup();

      const dialog = await openCategories(user);
      await user.click(dialog.getByRole("button", { name: "İçecekler sil" }));
      await user.click(await screen.findByRole("button", { name: "Sil" }));

      await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Kategoride ürün var"));
      expect(store.getState().categories).toHaveLength(2);
    });

    it("deletes an empty category", async () => {
      const { user, store } = setup();
      const dialog = await openCategories(user);
      await user.type(dialog.getByRole("textbox", { name: "Kategori adı" }), "Salatalar");
      await user.click(dialog.getByRole("button", { name: "Ekle" }));
      await waitFor(() => expect(store.getState().categories).toHaveLength(3));

      await user.click(dialog.getByRole("button", { name: "Salatalar sil" }));
      await user.click(await screen.findByRole("button", { name: "Sil" }));

      await waitFor(() => expect(store.getState().categories).toHaveLength(2));
    });

    it("will not offer a new product while there is no category to put it in", () => {
      setup(createEmptyPosState());

      expect(screen.getByRole("button", { name: "Yeni Ürün" })).toBeDisabled();
    });
  });
});
