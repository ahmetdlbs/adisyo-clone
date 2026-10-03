import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TableAreaScreen } from "@/features/pos/components/table-area-screen";
import { PosProvider, type PosSnapshot } from "@/features/pos/store/pos-provider";
import { buildPosSnapshot } from "../../../support/pos-fixtures";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

const actions = vi.hoisted(() => ({
  saveAreaAction: vi.fn(),
  moveAreaAction: vi.fn(),
  deleteAreaAction: vi.fn(),
  saveTableAction: vi.fn(),
  deleteTableAction: vi.fn(),
  addTablesAction: vi.fn(),
}));
vi.mock("@/features/pos/server/floor-plan-actions", () => actions);

beforeEach(() => {
  toast.success.mockClear();
  toast.error.mockClear();
  Object.values(actions).forEach((mock) => mock.mockReset());
});

const EMPTY_SNAPSHOT: PosSnapshot = { areas: [], tables: [], categories: [], products: [], orders: [] };

function setup(initial: PosSnapshot = buildPosSnapshot()) {
  render(
    <PosProvider initial={initial}>
      <TableAreaScreen />
    </PosProvider>
  );
  return { user: userEvent.setup() };
}

const tables = () => within(screen.getByRole("list", { name: "Masalar" }));

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
    setup(EMPTY_SNAPSHOT);

    expect(screen.getByText(/Henüz bölge yok/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Yeni Masa" })).toBeDisabled();
  });

  describe("a single table", () => {
    it("adds a table to the current area", async () => {
      actions.saveTableAction.mockResolvedValue({ id: "t3", name: "Masa 3", areaId: "a1", shape: "square" });
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: "Yeni Masa" }));
      const dialog = within(await screen.findByRole("dialog", { name: "Masa Tanımlama" }));
      await user.type(dialog.getByRole("textbox", { name: /Masa Adı/ }), "Masa 3");
      await user.click(dialog.getByRole("button", { name: "Kaydet" }));

      await waitFor(() => expect(tables().getByText("Masa 3")).toBeInTheDocument());
      expect(actions.saveTableAction).toHaveBeenCalledWith(null, expect.objectContaining({ name: "Masa 3", areaId: "a1" }));
      expect(toast.success).toHaveBeenCalledWith("Masa eklendi");
    });

    it("requires a name", async () => {
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: "Yeni Masa" }));
      await user.click(within(await screen.findByRole("dialog", { name: "Masa Tanımlama" })).getByRole("button", { name: "Kaydet" }));

      expect(await screen.findByText("Masa adı zorunludur")).toBeInTheDocument();
      expect(actions.saveTableAction).not.toHaveBeenCalled();
    });

    it("shows the API's reason on the field when the name is already used, and keeps the dialog open", async () => {
      actions.saveTableAction.mockRejectedValue(new Error("Bu masa adı zaten kullanılıyor"));
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: "Yeni Masa" }));
      const dialog = within(await screen.findByRole("dialog", { name: "Masa Tanımlama" }));
      await user.type(dialog.getByRole("textbox", { name: /Masa Adı/ }), "masa 1");
      await user.click(dialog.getByRole("button", { name: "Kaydet" }));

      expect(await screen.findByText("Bu masa adı zaten kullanılıyor")).toBeInTheDocument();
      expect(screen.getByRole("dialog", { name: "Masa Tanımlama" })).toBeInTheDocument();
    });

    it("edits a table with its values prefilled", async () => {
      actions.saveTableAction.mockResolvedValue({ id: "t2", name: "VIP", areaId: "a1", shape: "square" });
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: "Masa 2 düzenle" }));
      const dialog = within(await screen.findByRole("dialog", { name: "Masa Tanımlama" }));
      const name = dialog.getByRole("textbox", { name: /Masa Adı/ });
      expect(name).toHaveValue("Masa 2");
      await user.clear(name);
      await user.type(name, "VIP");
      await user.click(dialog.getByRole("button", { name: "Güncelle" }));

      await waitFor(() => expect(tables().getByText("VIP")).toBeInTheDocument());
      expect(tables().queryByText("Masa 2")).not.toBeInTheDocument();
      expect(toast.success).toHaveBeenCalledWith("Masa güncellendi");
    });

    it("deletes a free table after confirming", async () => {
      actions.deleteTableAction.mockResolvedValue(undefined);
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: "Masa 2 sil" }));
      await user.click(await screen.findByRole("button", { name: "Sil" }));

      await waitFor(() => expect(tables().queryByText("Masa 2")).not.toBeInTheDocument());
      expect(toast.success).toHaveBeenCalledWith("Masa silindi");
    });

    it("refuses to delete a table that has a bill, and says so", async () => {
      actions.deleteTableAction.mockRejectedValue(new Error("Açık siparişi olan masa silinemez"));
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: "Masa 1 sil" }));
      await user.click(await screen.findByRole("button", { name: "Sil" }));

      await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Açık siparişi olan masa silinemez"));
      expect(tables().getByText("Masa 1")).toBeInTheDocument();
    });
  });

  describe("several tables at once", () => {
    const openBulk = async (user: ReturnType<typeof userEvent.setup>) => {
      await user.click(screen.getByRole("button", { name: "Toplu Masa Ekle" }));
      return within(await screen.findByRole("dialog", { name: "Toplu Masa Ekleme" }));
    };

    it("adds numbered tables that carry on from the highest number in use", async () => {
      actions.addTablesAction.mockResolvedValue([
        { id: "t3", name: "Masa 3", areaId: "a1", shape: "square" },
        { id: "t4", name: "Masa 4", areaId: "a1", shape: "square" },
        { id: "t5", name: "Masa 5", areaId: "a1", shape: "square" },
      ]);
      const { user } = setup();

      const dialog = await openBulk(user);
      const count = dialog.getByRole("spinbutton", { name: /Miktar/ });
      await user.clear(count);
      await user.type(count, "3");
      await user.click(dialog.getByRole("button", { name: "Kaydet" }));

      await waitFor(() => expect(tables().getByText("Masa 5")).toBeInTheDocument());
      expect(tables().getByText("Masa 3")).toBeInTheDocument();
      expect(tables().getByText("Masa 4")).toBeInTheDocument();
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
      expect(actions.addTablesAction).not.toHaveBeenCalled();
    });
  });

  describe("areas", () => {
    const openAreas = async (user: ReturnType<typeof userEvent.setup>) => {
      await user.click(screen.getByRole("button", { name: "Bölgeleri Yönet" }));
      return within(await screen.findByRole("dialog", { name: "Bölgeleri Yönet" }));
    };

    it("adds an area, which becomes a tab", async () => {
      actions.saveAreaAction.mockResolvedValue({ id: "a3", name: "Teras" });
      const { user } = setup();

      const dialog = await openAreas(user);
      await user.type(dialog.getByRole("textbox", { name: "Bölge adı" }), "Teras");
      await user.click(dialog.getByRole("button", { name: "Ekle" }));

      await waitFor(() => expect(actions.saveAreaAction).toHaveBeenCalledWith(null, "Teras"));
      expect(toast.success).toHaveBeenCalledWith("Bölge eklendi");
    });

    it("renames an area", async () => {
      actions.saveAreaAction.mockResolvedValue({ id: "a2", name: "Bahçe" });
      const { user } = setup();

      const dialog = await openAreas(user);
      await user.click(dialog.getByRole("button", { name: "bölge 2 düzenle" }));
      const name = dialog.getByRole("textbox", { name: "Bölge adı" });
      expect(name).toHaveValue("bölge 2");
      await user.clear(name);
      await user.type(name, "Bahçe");
      await user.click(dialog.getByRole("button", { name: "Güncelle" }));

      await waitFor(() => expect(dialog.getByText("Bahçe")).toBeInTheDocument());
    });

    it("rejects a duplicate area name on the field", async () => {
      actions.saveAreaAction.mockRejectedValue(new Error("Bu bölge zaten tanımlı"));
      const { user } = setup();

      const dialog = await openAreas(user);
      await user.type(dialog.getByRole("textbox", { name: "Bölge adı" }), "SALON");
      await user.click(dialog.getByRole("button", { name: "Ekle" }));

      expect(await screen.findByText("Bu bölge zaten tanımlı")).toBeInTheDocument();
    });

    it("reorders areas", async () => {
      actions.moveAreaAction.mockResolvedValue([
        { id: "a2", name: "bölge 2" },
        { id: "a1", name: "Salon" },
      ]);
      const { user } = setup();

      const dialog = await openAreas(user);
      await user.click(dialog.getByRole("button", { name: "bölge 2 yukarı taşı" }));

      await waitFor(() => expect(dialog.getByRole("button", { name: "bölge 2 yukarı taşı" })).toBeDisabled());
      expect(actions.moveAreaAction).toHaveBeenCalledWith("a2", -1);
    });

    it("deletes an empty-of-bills area after confirming, together with its tables", async () => {
      actions.deleteAreaAction.mockResolvedValue(undefined);
      const { user } = setup();

      const dialog = await openAreas(user);
      await user.click(dialog.getByRole("button", { name: "bölge 2 sil" }));
      await user.click(await screen.findByRole("button", { name: "Sil" }));

      await waitFor(() => expect(dialog.queryByText("bölge 2")).not.toBeInTheDocument());
      expect(screen.queryByRole("tab", { name: "bölge 2" })).not.toBeInTheDocument();
      expect(actions.deleteAreaAction).toHaveBeenCalledWith("a2");
    });

    it("refuses to delete an area that has a table with a bill", async () => {
      actions.deleteAreaAction.mockRejectedValue(new Error("Bölgede açık siparişi olan masa var"));
      const { user } = setup();

      const dialog = await openAreas(user);
      await user.click(dialog.getByRole("button", { name: "Salon sil" }));
      await user.click(await screen.findByRole("button", { name: "Sil" }));

      await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Bölgede açık siparişi olan masa var"));
      expect(dialog.getByText("Salon")).toBeInTheDocument();
    });
  });
});
