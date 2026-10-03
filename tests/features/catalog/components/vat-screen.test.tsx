import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MAX_VAT_DEFINITIONS, type VatDefinition } from "@/features/catalog/model/vat";
import { VatScreen } from "@/features/catalog/components/vat-screen";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

const actions = vi.hoisted(() => ({ createVat: vi.fn(), updateVat: vi.fn(), deleteVat: vi.fn() }));
vi.mock("@/features/catalog/server/vat-actions", () => actions);

beforeEach(() => {
  toast.success.mockClear();
  toast.error.mockClear();
  Object.values(actions).forEach((mock) => mock.mockReset());
});

const FOOD: VatDefinition = { id: "1", name: "Yiyecek", rate: 10, isDefault: true };
const DRINK: VatDefinition = { id: "2", name: "İçecek", rate: 10, isDefault: false };

function setup(vats: readonly VatDefinition[] = [FOOD, DRINK]) {
  render(<VatScreen vats={vats} />);
  return { user: userEvent.setup() };
}

const dialog = () => screen.findByRole("dialog", { name: "KDV Grubu Tanımla" });
const rowOf = (name: string) => screen.getByRole("row", { name: new RegExp(name) });
const defaultBadges = () => screen.queryAllByText("Varsayılan");

async function addDefinition(
  user: ReturnType<typeof userEvent.setup>,
  { name, rate, makeDefault = false }: { name: string; rate: string; makeDefault?: boolean }
) {
  await user.click(screen.getByRole("button", { name: "Yeni KDV Grubu Ekle" }));
  const form = within(await dialog());
  await user.type(form.getByRole("textbox", { name: /Tanım Adı/ }), name);
  await user.click(form.getByRole("combobox", { name: /KDV Oranı/ }));
  await user.click(await screen.findByRole("option", { name: rate }));
  if (makeDefault) await user.click(form.getByRole("switch", { name: "Varsayılan" }));
  await user.click(form.getByRole("button", { name: "Ekle" }));
}

describe("VatScreen", () => {
  it("lists the definitions with their rates and marks the default", () => {
    setup();

    expect(screen.getByRole("heading", { level: 1, name: "Kdv Oranları" })).toBeInTheDocument();
    expect(within(rowOf("İçecek")).getByText("%10")).toBeInTheDocument();
    expect(within(rowOf("Yiyecek")).getByText("Varsayılan")).toBeInTheDocument();
    expect(defaultBadges()).toHaveLength(1);
  });

  it("adds a definition and calls the API with the entered values", async () => {
    actions.createVat.mockResolvedValue({ id: "3", name: "Alkol", rate: 20, isDefault: false });
    const { user } = setup();

    await addDefinition(user, { name: "Alkol", rate: "%20" });

    expect(actions.createVat).toHaveBeenCalledWith({ name: "Alkol", rate: 20, isDefault: false });
    expect(toast.success).toHaveBeenCalledWith("KDV grubu eklendi");
  });

  it("asks the API to make the new definition the default", async () => {
    actions.createVat.mockResolvedValue({ id: "3", name: "Alkol", rate: 20, isDefault: true });
    const { user } = setup();

    await addDefinition(user, { name: "Alkol", rate: "%20", makeDefault: true });

    expect(actions.createVat).toHaveBeenCalledWith({ name: "Alkol", rate: 20, isDefault: true });
  });

  it("deletes a definition after confirming", async () => {
    actions.deleteVat.mockResolvedValue(undefined);
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yiyecek sil" }));
    await user.click(await screen.findByRole("button", { name: "Sil" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("KDV grubu silindi"));
    expect(actions.deleteVat).toHaveBeenCalledWith("1");
  });

  it("shows an error toast when deleting fails", async () => {
    actions.deleteVat.mockRejectedValue(new Error("KDV grubu silinemedi"));
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yiyecek sil" }));
    await user.click(await screen.findByRole("button", { name: "Sil" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("KDV grubu silinemedi"));
  });

  it("requires a name and a rate", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni KDV Grubu Ekle" }));
    await dialog();
    await user.click(screen.getByRole("button", { name: "Ekle" }));

    expect(await screen.findByText("Tanım adı zorunludur")).toBeInTheDocument();
    expect(screen.getByText("KDV oranı zorunludur")).toBeInTheDocument();
    expect(actions.createVat).not.toHaveBeenCalled();
  });

  it("stops offering new groups once the maximum is reached", () => {
    const full = Array.from({ length: MAX_VAT_DEFINITIONS }, (_, index) => ({
      id: String(index),
      name: `Grup ${index}`,
      rate: 10,
      isDefault: index === 0,
    }));

    setup(full);

    expect(screen.getByRole("button", { name: "Yeni KDV Grubu Ekle" })).toBeDisabled();
  });
});
