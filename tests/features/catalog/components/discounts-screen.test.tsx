import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DiscountsScreen } from "@/features/catalog/components/discounts-screen";

const toast = vi.hoisted(() => ({ success: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

beforeEach(() => {
  toast.success.mockClear();
  toast.info.mockClear();
});

function setup() {
  render(<DiscountsScreen />);
  return { user: userEvent.setup() };
}

const dialog = () => screen.findByRole("dialog", { name: "İndirim Tanımla" });

async function fillAndSubmit(
  user: ReturnType<typeof userEvent.setup>,
  { name, amount, type }: { name?: string; amount?: string; type?: string }
) {
  const form = within(await dialog());
  if (name) await user.type(form.getByRole("textbox", { name: /İndirim Adı/ }), name);
  if (type) {
    await user.click(form.getByRole("combobox", { name: /İndirim Tipi/ }));
    await user.click(await screen.findByRole("option", { name: type }));
  }
  if (amount) await user.type(form.getByRole("spinbutton", { name: /İndirim Tutarı/ }), amount);
  await user.click(form.getByRole("button", { name: "Ekle" }));
}

describe("DiscountsScreen", () => {
  it("shows an empty message until a discount exists", () => {
    setup();

    expect(screen.getByRole("heading", { level: 1, name: "İndirimler" })).toBeInTheDocument();
    expect(screen.getByText("Hiç indirim kaydı bulunamadı.")).toBeInTheDocument();
  });

  it("adds a percentage discount", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni" }));
    await fillAndSubmit(user, { name: "Öğrenci", amount: "10" });

    const row = await screen.findByRole("row", { name: /Öğrenci/ });
    expect(within(row).getByText("Yüzde (%)")).toBeInTheDocument();
    expect(within(row).getByText("%10")).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith("İndirim eklendi");
  });

  it("adds a fixed-amount discount shown as lira", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni" }));
    await fillAndSubmit(user, { name: "Kupon", type: "Tutar (₺)", amount: "250" });

    const row = await screen.findByRole("row", { name: /Kupon/ });
    expect(within(row).getByText("₺250,00")).toBeInTheDocument();
  });

  it("lists everything that is missing when submitting an empty form", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni" }));
    await fillAndSubmit(user, {});

    expect(await screen.findByText("İndirim adı zorunludur")).toBeInTheDocument();
    expect(screen.getByText("Tutar zorunludur")).toBeInTheDocument();
  });

  it("does not accept more than 100 percent", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni" }));
    await fillAndSubmit(user, { name: "Bedava", amount: "150" });

    expect(await screen.findByText("Yüzde en fazla 100 olabilir")).toBeInTheDocument();
    expect(screen.queryByRole("row", { name: /Bedava/ })).not.toBeInTheDocument();
  });

  it("edits a discount", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "Yeni" }));
    await fillAndSubmit(user, { name: "Öğrenci", amount: "10" });
    await screen.findByRole("row", { name: /Öğrenci/ });

    await user.click(screen.getByRole("button", { name: "Öğrenci düzenle" }));
    const amount = within(await dialog()).getByRole("spinbutton", { name: /İndirim Tutarı/ });
    expect(amount).toHaveValue(10);
    await user.clear(amount);
    await user.type(amount, "15");
    await user.click(screen.getByRole("button", { name: "Kaydet" }));

    expect(await screen.findByText("%15")).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith("İndirim güncellendi");
  });

  it("deletes a discount only after confirmation", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "Yeni" }));
    await fillAndSubmit(user, { name: "Öğrenci", amount: "10" });
    await screen.findByRole("row", { name: /Öğrenci/ });

    await user.click(screen.getByRole("button", { name: "Öğrenci sil" }));
    await user.click(await screen.findByRole("button", { name: "Sil" }));

    await waitFor(() => expect(screen.queryByRole("row", { name: /Öğrenci/ })).not.toBeInTheDocument());
    expect(screen.getByText("Hiç indirim kaydı bulunamadı.")).toBeInTheDocument();
  });

  it("says the download is not available yet instead of doing nothing", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "İndir" }));

    expect(toast.info).toHaveBeenCalledWith("Bu özellik henüz kullanılabilir değil.");
  });
});
