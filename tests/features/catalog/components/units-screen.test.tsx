import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UnitsScreen } from "@/features/catalog/components/units-screen";
import type { Unit } from "@/features/catalog/model/unit";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

const actions = vi.hoisted(() => ({ createUnit: vi.fn(), updateUnit: vi.fn(), deleteUnit: vi.fn() }));
vi.mock("@/features/catalog/server/unit-actions", () => actions);

beforeEach(() => {
  toast.success.mockClear();
  toast.error.mockClear();
  Object.values(actions).forEach((mock) => mock.mockReset());
});

const UNITS: Unit[] = [
  { id: "1", name: "Tam" },
  { id: "2", name: "Yarım" },
  { id: "3", name: "Kg" },
];

function setup(units: readonly Unit[] = UNITS) {
  render(<UnitsScreen units={units} />);
  return { user: userEvent.setup() };
}

async function openDialog() {
  return screen.findByRole("dialog", { name: "Birim Tanımla" });
}

const nameField = (dialog: HTMLElement) => within(dialog).getByRole("textbox", { name: /Birim Adı/ });

describe("UnitsScreen", () => {
  it("shows the page heading and the given units", () => {
    setup();

    expect(screen.getByRole("heading", { level: 1, name: "Porsiyon/Birim Yönetimi" })).toBeInTheDocument();
    for (const name of ["Tam", "Yarım", "Kg"]) {
      expect(screen.getByRole("cell", { name })).toBeInTheDocument();
    }
  });

  it("adds a unit through the dialog", async () => {
    actions.createUnit.mockResolvedValue({ id: "4", name: "Bardak" });
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni" }));
    await user.type(nameField(await openDialog()), "Bardak");
    await user.click(screen.getByRole("button", { name: "Ekle" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Birim eklendi"));
    expect(actions.createUnit).toHaveBeenCalledWith({ name: "Bardak" });
  });

  it("explains why an empty name cannot be saved and keeps the dialog open", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni" }));
    await openDialog();
    await user.click(screen.getByRole("button", { name: "Ekle" }));

    expect(await screen.findByText("Birim adı zorunludur")).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Birim Tanımla" })).toBeInTheDocument();
    expect(actions.createUnit).not.toHaveBeenCalled();
  });

  it("shows the API's reason on the field when the name is already used, and keeps the dialog open", async () => {
    actions.createUnit.mockRejectedValue(new Error("Bu birim zaten tanımlı"));
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni" }));
    await user.type(nameField(await openDialog()), "tam");
    await user.click(screen.getByRole("button", { name: "Ekle" }));

    expect(await screen.findByText("Bu birim zaten tanımlı")).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Birim Tanımla" })).toBeInTheDocument();
  });

  it("edits a unit with its current name prefilled", async () => {
    actions.updateUnit.mockResolvedValue({ id: "2", name: "Buçuk" });
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yarım düzenle" }));
    const field = nameField(await openDialog());
    expect(field).toHaveValue("Yarım");
    await user.clear(field);
    await user.type(field, "Buçuk");
    await user.click(screen.getByRole("button", { name: "Güncelle" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Birim güncellendi"));
    expect(actions.updateUnit).toHaveBeenCalledWith("2", { name: "Buçuk" });
  });

  it("starts every new dialog with an empty form, even right after an edit was cancelled", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "Tam düzenle" }));
    await openDialog();
    await user.click(screen.getByRole("button", { name: "Vazgeç" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: "Yeni" }));

    expect(nameField(await openDialog())).toHaveValue("");
  });

  it("asks before deleting and calls the API once confirmed", async () => {
    actions.deleteUnit.mockResolvedValue(undefined);
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Kg sil" }));
    // The confirmation is modal, so the table behind it is aria-hidden: query by text, not by role.
    expect(screen.getByText("Kg", { selector: "td" })).toBeInTheDocument();
    await user.click(await screen.findByRole("button", { name: "Sil" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Birim silindi"));
    expect(actions.deleteUnit).toHaveBeenCalledWith("3");
  });

  it("shows an error toast when deleting fails", async () => {
    actions.deleteUnit.mockRejectedValue(new Error("Birim silinemedi"));
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Kg sil" }));
    await user.click(await screen.findByRole("button", { name: "Sil" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Birim silinemedi"));
  });
});
