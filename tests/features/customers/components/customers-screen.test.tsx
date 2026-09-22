import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CustomersScreen } from "@/features/customers/components/customers-screen";
import type { Customer } from "@/features/customers/model/customer";
import { UNAVAILABLE_MESSAGE } from "@/lib/notify";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

beforeEach(() => {
  Object.values(toast).forEach((mock) => mock.mockClear());
});

const ALI: Customer = { id: "c1", no: 1, firstName: "Ali", lastName: "Yılmaz", phone: "0532 123 45 67", phone2: "", balance: 15050 };
const AYSE: Customer = { id: "c2", no: 2, firstName: "Ayşe", lastName: "Kaya", phone: "0533 111 22 33", phone2: "", balance: 0 };

const setup = (customers: Customer[] = []) => {
  render(<CustomersScreen initialCustomers={customers} />);
  return userEvent.setup();
};

const summary = () => screen.getByTestId("page-header-description");
const rowOf = (name: string) => screen.getByRole("row", { name: new RegExp(name) });

async function fillCustomer(user: ReturnType<typeof userEvent.setup>, values: { firstName?: string; phone?: string; balance?: string }) {
  const dialog = within(await screen.findByRole("dialog", { name: "Müşteri Ekle" }));
  if (values.firstName !== undefined) await user.type(dialog.getByRole("textbox", { name: /^Ad/ }), values.firstName);
  if (values.phone !== undefined) await user.type(dialog.getByRole("textbox", { name: "Telefon" }), values.phone);
  if (values.balance !== undefined) {
    const balance = dialog.getByRole("textbox", { name: /Bakiye/ });
    await user.clear(balance);
    await user.type(balance, values.balance);
  }
  return dialog;
}

describe("CustomersScreen", () => {
  it("counts the customers and what they owe", () => {
    setup([ALI, AYSE]);

    expect(screen.getByRole("heading", { level: 1, name: "Müşteriler" })).toBeInTheDocument();
    expect(summary()).toHaveTextContent("Müşteri Sayısı : 2");
    expect(summary()).toHaveTextContent("Toplam Bakiye : ₺150,50");
  });

  it("lists each customer with their number, phone and balance", () => {
    setup([ALI, AYSE]);

    expect(rowOf("Ali Yılmaz")).toHaveTextContent("1");
    expect(rowOf("Ali Yılmaz")).toHaveTextContent("0532 123 45 67");
    expect(rowOf("Ali Yılmaz")).toHaveTextContent("₺150,50");
  });

  it("marks only the customers who owe something as open-account", () => {
    setup([ALI, AYSE]);

    expect(within(rowOf("Ali Yılmaz")).getByText("Açık Hesap")).toBeInTheDocument();
    expect(within(rowOf("Ayşe Kaya")).queryByText("Açık Hesap")).not.toBeInTheDocument();
  });

  it("says there are no customers yet", () => {
    setup();

    expect(screen.getByText("Hiç müşteri kaydı bulunamadı.")).toBeInTheDocument();
    expect(summary()).toHaveTextContent("Toplam Bakiye : ₺0,00");
  });

  describe("search", () => {
    it("finds a customer by name, with Turkish case rules", async () => {
      const user = setup([ALI, AYSE]);

      await user.type(screen.getByRole("searchbox", { name: "Müşteri Arama" }), "AYŞE");

      expect(screen.getByRole("row", { name: /Ayşe Kaya/ })).toBeInTheDocument();
      expect(screen.queryByRole("row", { name: /Ali Yılmaz/ })).not.toBeInTheDocument();
    });

    it("finds a customer by phone number", async () => {
      const user = setup([ALI, AYSE]);

      await user.type(screen.getByRole("searchbox", { name: "Müşteri Arama" }), "111 22");

      expect(screen.getByRole("row", { name: /Ayşe Kaya/ })).toBeInTheDocument();
      expect(screen.queryByRole("row", { name: /Ali Yılmaz/ })).not.toBeInTheDocument();
    });

    it("says nothing matched, which is not the same as having no customers", async () => {
      const user = setup([ALI]);

      await user.type(screen.getByRole("searchbox", { name: "Müşteri Arama" }), "zzz");

      expect(screen.getByText("Arama kriterlerine uygun müşteri bulunamadı.")).toBeInTheDocument();
    });
  });

  describe("adding", () => {
    it("adds a customer and updates the totals", async () => {
      const user = setup([ALI]);

      await user.click(screen.getByRole("button", { name: "Ekle" }));
      const dialog = await fillCustomer(user, { firstName: "Veli", phone: "0544 555 66 77", balance: "25,5" });
      await user.click(dialog.getByRole("button", { name: "Ekle" }));

      await waitFor(() => expect(screen.getByRole("row", { name: /Veli/ })).toBeInTheDocument());
      expect(rowOf("Veli")).toHaveTextContent("2");
      expect(rowOf("Veli")).toHaveTextContent("₺25,50");
      expect(summary()).toHaveTextContent("Müşteri Sayısı : 2");
      expect(summary()).toHaveTextContent("Toplam Bakiye : ₺176,00");
      expect(toast.success).toHaveBeenCalledWith("Müşteri eklendi");
    });

    it("asks for a first name", async () => {
      const user = setup();

      await user.click(screen.getByRole("button", { name: "Ekle" }));
      await user.click(within(await screen.findByRole("dialog", { name: "Müşteri Ekle" })).getByRole("button", { name: "Ekle" }));

      expect(await screen.findByText("Ad zorunludur")).toBeInTheDocument();
    });

    it("shows the reason on the phone field when the number is already a customer's", async () => {
      const user = setup([ALI]);

      await user.click(screen.getByRole("button", { name: "Ekle" }));
      const dialog = await fillCustomer(user, { firstName: "Veli", phone: "05321234567" });
      await user.click(dialog.getByRole("button", { name: "Ekle" }));

      expect(await screen.findByText("Bu telefon numarası başka bir müşteride kayıtlı")).toBeInTheDocument();
      expect(summary()).toHaveTextContent("Müşteri Sayısı : 1");
    });
  });

  describe("editing and deleting", () => {
    it("edits a customer with their values filled in", async () => {
      const user = setup([ALI]);

      await user.click(screen.getByRole("button", { name: "Ali Yılmaz düzenle" }));
      const dialog = within(await screen.findByRole("dialog", { name: "Müşteri Ekle" }));
      const name = dialog.getByRole("textbox", { name: /^Ad/ });
      expect(name).toHaveValue("Ali");
      expect(dialog.getByRole("textbox", { name: /Bakiye/ })).toHaveValue("150,5");
      await user.clear(name);
      await user.type(name, "Mehmet");
      await user.click(dialog.getByRole("button", { name: "Güncelle" }));

      await waitFor(() => expect(screen.getByRole("row", { name: /Mehmet Yılmaz/ })).toBeInTheDocument());
      expect(toast.success).toHaveBeenCalledWith("Müşteri güncellendi");
    });

    it("deletes a customer after confirming", async () => {
      const user = setup([ALI, AYSE]);

      await user.click(screen.getByRole("button", { name: "Ali Yılmaz sil" }));
      await user.click(await screen.findByRole("button", { name: "Sil" }));

      await waitFor(() => expect(screen.queryByRole("row", { name: /Ali Yılmaz/ })).not.toBeInTheDocument());
      expect(summary()).toHaveTextContent("Müşteri Sayısı : 1");
      expect(toast.success).toHaveBeenCalledWith("Müşteri silindi");
    });
  });

  describe("paging", () => {
    const many = Array.from({ length: 12 }, (_, index): Customer => ({ ...ALI, id: `c${index}`, no: index + 1, firstName: `Müşteri${index + 1}`, phone: "", balance: 0 }));

    it("shows ten customers a page", async () => {
      const user = setup(many);

      expect(screen.getAllByRole("row")).toHaveLength(1 + 10);
      expect(screen.getByRole("navigation", { name: "Sayfalama" })).toHaveTextContent("1 / 2");

      await user.click(screen.getByRole("button", { name: "Sonraki sayfa" }));

      expect(screen.getAllByRole("row")).toHaveLength(1 + 2);
      expect(screen.getByRole("row", { name: /Müşteri11 / })).toBeInTheDocument();
    });

    it("goes back to the first page when the search changes", async () => {
      const user = setup(many);
      await user.click(screen.getByRole("button", { name: "Sonraki sayfa" }));

      await user.type(screen.getByRole("searchbox", { name: "Müşteri Arama" }), "Müşteri1");

      expect(screen.getByRole("navigation", { name: "Sayfalama" })).toHaveTextContent("1 / 1");
    });
  });

  it("tells the user that import and download are not available yet", async () => {
    const user = setup();

    await user.click(screen.getByRole("button", { name: "Müşterileri Yükle" }));
    await user.click(screen.getByRole("button", { name: "İndir" }));

    expect(toast.info).toHaveBeenCalledTimes(2);
    expect(toast.info).toHaveBeenCalledWith(UNAVAILABLE_MESSAGE);
  });
});
