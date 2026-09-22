import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UnitsScreen } from "@/features/catalog/components/units-screen";

const toast = vi.hoisted(() => ({ success: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

beforeEach(() => {
  toast.success.mockClear();
});

function setup() {
  render(<UnitsScreen />);
  return { user: userEvent.setup() };
}

async function openDialog() {
  return screen.findByRole("dialog", { name: "Birim Tanımla" });
}

const nameField = (dialog: HTMLElement) => within(dialog).getByRole("textbox", { name: /Birim Adı/ });

describe("UnitsScreen", () => {
  it("shows the page heading and the existing units", () => {
    setup();

    expect(screen.getByRole("heading", { level: 1, name: "Porsiyon/Birim Yönetimi" })).toBeInTheDocument();
    for (const name of ["Tam", "Yarım", "Bir buçuk", "Adet", "Kg"]) {
      expect(screen.getByRole("cell", { name })).toBeInTheDocument();
    }
  });

  it("adds a unit through the dialog", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni" }));
    await user.type(nameField(await openDialog()), "Bardak");
    await user.click(screen.getByRole("button", { name: "Ekle" }));

    expect(await screen.findByRole("cell", { name: "Bardak" })).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(toast.success).toHaveBeenCalledWith("Birim eklendi");
  });

  it("explains why an empty name cannot be saved and keeps the dialog open", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni" }));
    await openDialog();
    await user.click(screen.getByRole("button", { name: "Ekle" }));

    expect(await screen.findByText("Birim adı zorunludur")).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Birim Tanımla" })).toBeInTheDocument();
  });

  it("rejects a name that already exists", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni" }));
    await user.type(nameField(await openDialog()), "tam");
    await user.click(screen.getByRole("button", { name: "Ekle" }));

    expect(await screen.findByText("Bu birim zaten tanımlı")).toBeInTheDocument();
  });

  it("edits a unit with its current name prefilled", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yarım düzenle" }));
    const field = nameField(await openDialog());
    expect(field).toHaveValue("Yarım");
    await user.clear(field);
    await user.type(field, "Buçuk");
    await user.click(screen.getByRole("button", { name: "Güncelle" }));

    expect(await screen.findByRole("cell", { name: "Buçuk" })).toBeInTheDocument();
    expect(screen.queryByRole("cell", { name: "Yarım" })).not.toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith("Birim güncellendi");
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

  it("asks before deleting and removes the unit once confirmed", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Kg sil" }));
    // The confirmation is modal, so the table behind it is aria-hidden: query by text, not by role.
    expect(screen.getByText("Kg", { selector: "td" })).toBeInTheDocument();
    await user.click(await screen.findByRole("button", { name: "Sil" }));

    await waitFor(() => expect(screen.queryByRole("cell", { name: "Kg" })).not.toBeInTheDocument());
    expect(toast.success).toHaveBeenCalledWith("Birim silindi");
  });
});
