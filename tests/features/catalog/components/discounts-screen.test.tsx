import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DiscountsScreen } from "@/features/catalog/components/discounts-screen";
import type { Discount } from "@/features/catalog/model/discount";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

const actions = vi.hoisted(() => ({ createDiscount: vi.fn(), updateDiscount: vi.fn(), deleteDiscount: vi.fn() }));
vi.mock("@/features/catalog/server/discount-actions", () => actions);

beforeEach(() => {
  toast.success.mockClear();
  toast.error.mockClear();
  toast.info.mockClear();
  Object.values(actions).forEach((mock) => mock.mockReset());
});

const OGRENCI: Discount = { id: "1", name: "Öğrenci", type: "percent", amount: 10 };

function setup(discounts: readonly Discount[] = []) {
  render(<DiscountsScreen discounts={discounts} />);
  return { user: userEvent.setup() };
}

const dialog = () => screen.findByRole("dialog", { name: "İndirim Tanımla" });

async function fillAndSubmit(
  user: ReturnType<typeof userEvent.setup>,
  { name, amount, type, submit = "Ekle" }: { name?: string; amount?: string; type?: string; submit?: string }
) {
  const form = within(await dialog());
  if (name) await user.type(form.getByRole("textbox", { name: /İndirim Adı/ }), name);
  if (type) {
    await user.click(form.getByRole("combobox", { name: /İndirim Tipi/ }));
    await user.click(await screen.findByRole("option", { name: type }));
  }
  if (amount) await user.type(form.getByRole("spinbutton", { name: /İndirim Tutarı/ }), amount);
  await user.click(form.getByRole("button", { name: submit }));
}

describe("DiscountsScreen", () => {
  it("shows an empty message until a discount exists", () => {
    setup();

    expect(screen.getByRole("heading", { level: 1, name: "İndirimler" })).toBeInTheDocument();
    expect(screen.getByText("Hiç indirim kaydı bulunamadı.")).toBeInTheDocument();
  });

  it("lists a given discount with its type and formatted amount", () => {
    setup([OGRENCI]);

    const row = screen.getByRole("row", { name: /Öğrenci/ });
    expect(within(row).getByText("Yüzde (%)")).toBeInTheDocument();
    expect(within(row).getByText("%10")).toBeInTheDocument();
  });

  it("adds a percentage discount, calling the API with the entered values", async () => {
    actions.createDiscount.mockResolvedValue(OGRENCI);
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni" }));
    await fillAndSubmit(user, { name: "Öğrenci", amount: "10" });

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("İndirim eklendi"));
    expect(actions.createDiscount).toHaveBeenCalledWith({ name: "Öğrenci", type: "percent", amount: 10 });
  });

  it("adds a fixed-amount discount", async () => {
    actions.createDiscount.mockResolvedValue({ id: "2", name: "Kupon", type: "amount", amount: 250 });
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni" }));
    await fillAndSubmit(user, { name: "Kupon", type: "Tutar (₺)", amount: "250" });

    await waitFor(() => expect(actions.createDiscount).toHaveBeenCalledWith({ name: "Kupon", type: "amount", amount: 250 }));
  });

  it("lists everything that is missing when submitting an empty form", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni" }));
    await fillAndSubmit(user, {});

    expect(await screen.findByText("İndirim adı zorunludur")).toBeInTheDocument();
    expect(screen.getByText("Tutar zorunludur")).toBeInTheDocument();
    expect(actions.createDiscount).not.toHaveBeenCalled();
  });

  it("does not accept more than 100 percent", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni" }));
    await fillAndSubmit(user, { name: "Bedava", amount: "150" });

    expect(await screen.findByText("Yüzde en fazla 100 olabilir")).toBeInTheDocument();
    expect(actions.createDiscount).not.toHaveBeenCalled();
  });

  it("edits a discount", async () => {
    actions.updateDiscount.mockResolvedValue({ ...OGRENCI, amount: 15 });
    const { user } = setup([OGRENCI]);

    await user.click(screen.getByRole("button", { name: "Öğrenci düzenle" }));
    const amount = within(await dialog()).getByRole("spinbutton", { name: /İndirim Tutarı/ });
    expect(amount).toHaveValue(10);
    await user.clear(amount);
    await user.type(amount, "15");
    await user.click(screen.getByRole("button", { name: "Kaydet" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("İndirim güncellendi"));
    expect(actions.updateDiscount).toHaveBeenCalledWith("1", { name: "Öğrenci", type: "percent", amount: 15 });
  });

  it("deletes a discount only after confirmation", async () => {
    actions.deleteDiscount.mockResolvedValue(undefined);
    const { user } = setup([OGRENCI]);

    await user.click(screen.getByRole("button", { name: "Öğrenci sil" }));
    await user.click(await screen.findByRole("button", { name: "Sil" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("İndirim silindi"));
    expect(actions.deleteDiscount).toHaveBeenCalledWith("1");
  });

  it("says the download is not available yet instead of doing nothing", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "İndir" }));

    expect(toast.info).toHaveBeenCalledWith("Bu özellik henüz kullanılabilir değil.");
  });
});
