import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MAX_VAT_DEFINITIONS, type VatDefinition } from "@/features/catalog/model/vat";
import { VatScreen } from "@/features/catalog/components/vat-screen";

const toast = vi.hoisted(() => ({ success: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

beforeEach(() => {
  toast.success.mockClear();
});

function setup(initialVats?: readonly VatDefinition[]) {
  render(<VatScreen initialVats={initialVats} />);
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

  it("adds a definition", async () => {
    const { user } = setup();

    await addDefinition(user, { name: "Alkol", rate: "%20" });

    expect(within(await screen.findByRole("row", { name: /Alkol/ })).getByText("%20")).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith("KDV grubu eklendi");
  });

  it("moves the default badge to a definition that asks for it", async () => {
    const { user } = setup();

    await addDefinition(user, { name: "Alkol", rate: "%20", makeDefault: true });

    await waitFor(() => expect(within(rowOf("Alkol")).getByText("Varsayılan")).toBeInTheDocument());
    expect(defaultBadges()).toHaveLength(1);
  });

  it("promotes another definition when the default is deleted", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yiyecek sil" }));
    await user.click(await screen.findByRole("button", { name: "Sil" }));

    await waitFor(() => expect(screen.queryByRole("row", { name: /Yiyecek/ })).not.toBeInTheDocument());
    expect(within(rowOf("İçecek")).getByText("Varsayılan")).toBeInTheDocument();
  });

  it("requires a name and a rate", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni KDV Grubu Ekle" }));
    await dialog();
    await user.click(screen.getByRole("button", { name: "Ekle" }));

    expect(await screen.findByText("Tanım adı zorunludur")).toBeInTheDocument();
    expect(screen.getByText("KDV oranı zorunludur")).toBeInTheDocument();
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
