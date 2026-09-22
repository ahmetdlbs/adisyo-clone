import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TableAreaScreen } from "@/features/pos/components/table-area-screen";
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
      <TableAreaScreen />
    </PosProvider>
  );
  return { store, user: userEvent.setup() };
}

const tables = () => within(screen.getByRole("list", { name: "Masalar" }));
const names = (store: ReturnType<typeof setup>["store"]) => store.getState().tables.map((table) => table.name);

describe("TableAreaScreen", () => {
  it("shows the tables of the selected area and switches between areas", async () => {
    const { user } = setup();

    expect(screen.getByRole("heading", { level: 1, name: "Masa / Bölgeler" })).toBeInTheDocument();
    expect(tables().getByText("Masa 1")).toBeInTheDocument();
    expect(tables().queryByText("Bahçe 1")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "bölge 2" }));

    expect(tables().getByText("Bahçe 1")).toBeInTheDocument();
  });

  it("explains how to start when there is no area yet", () => {
    setup(createEmptyPosState());

    expect(screen.getByText(/Henüz bölge yok/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Yeni Masa" })).toBeDisabled();
  });

  describe("a single table", () => {
    it("adds a table to the current area", async () => {
      const { user, store } = setup();

      await user.click(screen.getByRole("button", { name: "Yeni Masa" }));
      const dialog = within(await screen.findByRole("dialog", { name: "Masa Tanımlama" }));
      await user.type(dialog.getByRole("textbox", { name: /Masa Adı/ }), "Masa 3");
      await user.click(dialog.getByRole("button", { name: "Kaydet" }));

      await waitFor(() => expect(names(store)).toContain("Masa 3"));
      expect(store.getState().tables.find((table) => table.name === "Masa 3")?.areaId).toBe("a1");
      expect(tables().getByText("Masa 3")).toBeInTheDocument();
      expect(toast.success).toHaveBeenCalledWith("Masa eklendi");
    });

    it("requires a name", async () => {
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: "Yeni Masa" }));
      await user.click(within(await screen.findByRole("dialog", { name: "Masa Tanımlama" })).getByRole("button", { name: "Kaydet" }));

      expect(await screen.findByText("Masa adı zorunludur")).toBeInTheDocument();
    });

    it("shows the model's reason on the field when the name is already used, and keeps the dialog open", async () => {
      const { user, store } = setup();

      await user.click(screen.getByRole("button", { name: "Yeni Masa" }));
      const dialog = within(await screen.findByRole("dialog", { name: "Masa Tanımlama" }));
      await user.type(dialog.getByRole("textbox", { name: /Masa Adı/ }), "masa 1");
      await user.click(dialog.getByRole("button", { name: "Kaydet" }));

      expect(await screen.findByText("Bu masa adı zaten kullanılıyor")).toBeInTheDocument();
      expect(store.getState().tables).toHaveLength(3);
    });

    it("edits a table with its values prefilled", async () => {
      const { user, store } = setup();

      await user.click(screen.getByRole("button", { name: "Masa 2 düzenle" }));
      const dialog = within(await screen.findByRole("dialog", { name: "Masa Tanımlama" }));
      const name = dialog.getByRole("textbox", { name: /Masa Adı/ });
      expect(name).toHaveValue("Masa 2");
      await user.clear(name);
      await user.type(name, "VIP");
      await user.click(dialog.getByRole("button", { name: "Güncelle" }));

      await waitFor(() => expect(names(store)).toContain("VIP"));
      expect(names(store)).not.toContain("Masa 2");
      expect(toast.success).toHaveBeenCalledWith("Masa güncellendi");
    });

    it("deletes a free table after confirming", async () => {
      const { user, store } = setup();

      await user.click(screen.getByRole("button", { name: "Masa 2 sil" }));
      await user.click(await screen.findByRole("button", { name: "Sil" }));

      await waitFor(() => expect(names(store)).not.toContain("Masa 2"));
      expect(toast.success).toHaveBeenCalledWith("Masa silindi");
    });

    it("refuses to delete a table that has a bill, and says so", async () => {
      const { user, store } = setup();

      await user.click(screen.getByRole("button", { name: "Masa 1 sil" }));
      await user.click(await screen.findByRole("button", { name: "Sil" }));

      await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Açık siparişi olan masa silinemez"));
      expect(names(store)).toContain("Masa 1");
    });
  });

  describe("several tables at once", () => {
    const openBulk = async (user: ReturnType<typeof setup>["user"]) => {
      await user.click(screen.getByRole("button", { name: "Toplu Masa Ekle" }));
      return within(await screen.findByRole("dialog", { name: "Toplu Masa Ekleme" }));
    };

    it("adds numbered tables that carry on from the highest number in use", async () => {
      const { user, store } = setup();

      const dialog = await openBulk(user);
      const count = dialog.getByRole("spinbutton", { name: /Miktar/ });
      await user.clear(count);
      await user.type(count, "3");
      await user.click(dialog.getByRole("button", { name: "Kaydet" }));

      await waitFor(() => expect(names(store)).toEqual(expect.arrayContaining(["Masa 3", "Masa 4", "Masa 5"])));
      expect(toast.success).toHaveBeenCalledWith("3 masa eklendi");
    });

    it("rejects a count outside 1–100", async () => {
      const { user } = setup();

      const dialog = await openBulk(user);
      const count = dialog.getByRole("spinbutton", { name: /Miktar/ });
      await user.clear(count);
      await user.type(count, "500");
      await user.click(dialog.getByRole("button", { name: "Kaydet" }));

      expect(await screen.findByText("Adet 1 ile 100 arasında olmalıdır")).toBeInTheDocument();
    });
  });

  describe("areas", () => {
    const openAreas = async (user: ReturnType<typeof setup>["user"]) => {
      await user.click(screen.getByRole("button", { name: "Bölgeleri Yönet" }));
      return within(await screen.findByRole("dialog", { name: "Bölgeleri Yönet" }));
    };

    it("adds an area, which becomes a tab", async () => {
      const { user, store } = setup();

      const dialog = await openAreas(user);
      await user.type(dialog.getByRole("textbox", { name: "Bölge adı" }), "Teras");
      await user.click(dialog.getByRole("button", { name: "Ekle" }));

      await waitFor(() => expect(store.getState().areas.map((area) => area.name)).toContain("Teras"));
      expect(toast.success).toHaveBeenCalledWith("Bölge eklendi");
    });

    it("renames an area", async () => {
      const { user, store } = setup();

      const dialog = await openAreas(user);
      await user.click(dialog.getByRole("button", { name: "bölge 2 düzenle" }));
      const name = dialog.getByRole("textbox", { name: "Bölge adı" });
      expect(name).toHaveValue("bölge 2");
      await user.clear(name);
      await user.type(name, "Bahçe");
      await user.click(dialog.getByRole("button", { name: "Güncelle" }));

      await waitFor(() => expect(store.getState().areas[1]?.name).toBe("Bahçe"));
    });

    it("rejects a duplicate area name on the field", async () => {
      const { user } = setup();

      const dialog = await openAreas(user);
      await user.type(dialog.getByRole("textbox", { name: "Bölge adı" }), "SALON");
      await user.click(dialog.getByRole("button", { name: "Ekle" }));

      expect(await screen.findByText("Bu bölge zaten tanımlı")).toBeInTheDocument();
    });

    it("reorders areas", async () => {
      const { user, store } = setup();

      const dialog = await openAreas(user);
      await user.click(dialog.getByRole("button", { name: "bölge 2 yukarı taşı" }));

      expect(store.getState().areas.map((area) => area.id)).toEqual(["a2", "a1"]);
      expect(dialog.getByRole("button", { name: "bölge 2 yukarı taşı" })).toBeDisabled();
    });

    it("deletes an empty-of-bills area after confirming, together with its tables", async () => {
      const { user, store } = setup();

      const dialog = await openAreas(user);
      await user.click(dialog.getByRole("button", { name: "bölge 2 sil" }));
      await user.click(await screen.findByRole("button", { name: "Sil" }));

      await waitFor(() => expect(store.getState().areas.map((area) => area.id)).toEqual(["a1"]));
      expect(names(store)).not.toContain("Bahçe 1");
    });

    it("refuses to delete an area that has a table with a bill", async () => {
      const { user, store } = setup();

      const dialog = await openAreas(user);
      await user.click(dialog.getByRole("button", { name: "Salon sil" }));
      await user.click(await screen.findByRole("button", { name: "Sil" }));

      await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Bölgede açık siparişi olan masa var"));
      expect(store.getState().areas).toHaveLength(2);
    });
  });
});
