import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OrdersScreen } from "@/features/pos/components/orders-screen";
import { createPosStore, PosProvider } from "@/features/pos/store/pos-provider";
import { buildPosState } from "../../../support/pos-fixtures";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

beforeEach(() => {
  toast.success.mockClear();
  toast.error.mockClear();
  toast.info.mockClear();
});

function setup() {
  const store = createPosStore({ initial: buildPosState(), storage: null });
  render(
    <PosProvider store={store}>
      <OrdersScreen />
    </PosProvider>
  );
  return { store, user: userEvent.setup() };
}

type User = ReturnType<typeof userEvent.setup>;

const table = (name: string) => screen.getByRole("button", { name: new RegExp(`^${name}`) });
// Found by markup, not by role: while a modal dialog is open the page behind it is aria-hidden.
const ticket = () => within(document.querySelector<HTMLElement>('aside[aria-label="Adisyon"]')!);
const totalOf = () => ticket().getByText("Toplam Tutar").nextElementSibling;
const payButton = () => screen.getByRole("button", { name: /^ÖDE/ });
const paymentDialog = () => screen.findByRole("dialog", { name: /Masa Adı: MASA 1/ });

async function typeAmount(user: User, digits: string) {
  const keys = within(await paymentDialog()).getByRole("group", { name: "Sayı tuşları" });
  for (const digit of digits) await user.click(within(keys).getByRole("button", { name: digit }));
}

describe("floor plan", () => {
  it("shows each area with how many of its tables are occupied, and an occupied table's bill", () => {
    setup();

    expect(screen.getByRole("tab", { name: /^Salon\s*1\/2$/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /^bölge 2\s*0\/1$/ })).toBeInTheDocument();
    expect(table("Masa 1")).toHaveTextContent("Ahmet Can");
    expect(table("Masa 1")).toHaveTextContent("₺209,00");
    expect(table("Masa 2")).not.toHaveTextContent("₺");
  });

  it("switches area", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("tab", { name: /^bölge 2\s*0\/1$/ }));

    expect(table("Bahçe 1")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Masa 1/ })).not.toBeInTheDocument();
  });

  it("opens the bill of an occupied table", async () => {
    const { user } = setup();

    await user.click(table("Masa 1"));

    expect(screen.getByRole("heading", { name: "Masa 1" })).toBeInTheDocument();
    expect(ticket().getByText("Coca Cola")).toBeInTheDocument();
    expect(totalOf()).toHaveTextContent("₺209,00");
  });

  it("opens a fresh bill on a free table, and forgets it if nothing was added", async () => {
    const { user, store } = setup();

    await user.click(table("Masa 2"));
    expect(screen.getByRole("heading", { name: "Masa 2" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Geri" }));

    expect(store.getState().orders).toHaveLength(1);
    expect(table("Masa 2")).toBeInTheDocument();
  });
});

describe("editing a bill", () => {
  it("adds products and shows them on the ticket", async () => {
    const { user } = setup();
    await user.click(table("Masa 2"));

    await user.click(screen.getByRole("button", { name: "Çay ekle" }));

    expect(ticket().getByText("1 × ₺52,00")).toBeInTheDocument();
    expect(totalOf()).toHaveTextContent("₺52,00");
    expect(within(screen.getByRole("group", { name: "Çay" })).getByText("1")).toBeInTheDocument();
  });

  it("raises and lowers the quantity, and stays open when the last item is taken off", async () => {
    const { user } = setup();
    await user.click(table("Masa 2"));

    await user.click(screen.getByRole("button", { name: "Çay ekle" }));
    await user.click(screen.getByRole("button", { name: "Çay arttır" }));
    expect(totalOf()).toHaveTextContent("₺104,00");
    await user.click(screen.getByRole("button", { name: "Çay azalt" }));
    await user.click(screen.getByRole("button", { name: "Çay azalt" }));

    expect(ticket().getByText(/Adisyon boş/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Masa 2" })).toBeInTheDocument();
  });

  it("browses categories and searches across all of them", async () => {
    const { user } = setup();
    await user.click(table("Masa 2"));

    await user.click(screen.getByRole("tab", { name: "İÇECEKLER" }));
    expect(screen.getByRole("button", { name: "Coca Cola ekle" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Cheesecake ekle" })).not.toBeInTheDocument();

    await user.type(screen.getByRole("searchbox", { name: "Ürün ara" }), "cake");
    expect(screen.getByRole("button", { name: "Cheesecake ekle" })).toBeInTheDocument();
  });

  it("makes a line complimentary, which takes it off the total", async () => {
    const { user } = setup();
    await user.click(table("Masa 1"));

    await user.click(screen.getByRole("button", { name: "Çay işlemleri" }));
    await user.click(await screen.findByRole("menuitem", { name: "İkram" }));

    expect(totalOf()).toHaveTextContent("₺105,00");
    expect(ticket().getByText("İkram")).toBeInTheDocument();
  });

  it("removes a line", async () => {
    const { user } = setup();
    await user.click(table("Masa 1"));

    await user.click(screen.getByRole("button", { name: "Coca Cola işlemleri" }));
    await user.click(await screen.findByRole("menuitem", { name: "Sil" }));

    expect(ticket().queryByText("Coca Cola")).not.toBeInTheDocument();
    expect(totalOf()).toHaveTextContent("₺104,00");
  });

  it("asks before resetting the bill", async () => {
    const { user } = setup();
    await user.click(table("Masa 1"));

    await user.click(screen.getByRole("button", { name: "Siparişi sıfırla" }));
    expect(await screen.findByRole("alertdialog")).toHaveTextContent("Sipariş sıfırlansın mı?");
    expect(ticket().queryByText("Coca Cola")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Sıfırla" }));

    await waitFor(() => expect(ticket().getByText(/Adisyon boş/)).toBeInTheDocument());
  });

  it("applies a discount and shows it in the totals", async () => {
    const { user } = setup();
    await user.click(table("Masa 1"));

    await user.click(screen.getByRole("button", { name: "İndirim" }));
    await user.type(await screen.findByRole("spinbutton", { name: /İndirim yüzdesi/ }), "10");
    await user.click(screen.getByRole("button", { name: "Uygula" }));

    expect(await ticket().findByText("İndirim (%10)")).toBeInTheDocument();
    expect(totalOf()).toHaveTextContent("₺188,10");
    expect(toast.success).toHaveBeenCalledWith("%10 indirim uygulandı");
  });

  it("refuses an impossible discount and says why", async () => {
    const { user } = setup();
    await user.click(table("Masa 1"));

    await user.click(screen.getByRole("button", { name: "İndirim" }));
    await user.type(await screen.findByRole("spinbutton", { name: /İndirim yüzdesi/ }), "150");
    await user.click(screen.getByRole("button", { name: "Uygula" }));

    expect(await screen.findByText("İndirim yüzdesi en fazla 100 olabilir")).toBeInTheDocument();
    expect(totalOf()).toHaveTextContent("₺209,00");
  });

  it("saves and returns to the floor", async () => {
    const { user } = setup();
    await user.click(table("Masa 1"));

    await user.click(screen.getByRole("button", { name: "KAYDET" }));

    expect(toast.success).toHaveBeenCalledWith("Sipariş kaydedildi");
    expect(screen.getByRole("tab", { name: /^Salon\s*1\/2$/ })).toBeInTheDocument();
  });
});

describe("paying", () => {
  it("takes the whole amount in cash and closes the table", async () => {
    const { user, store } = setup();
    await user.click(table("Masa 1"));
    await user.click(payButton());

    await user.click(within(await paymentDialog()).getByRole("button", { name: "Nakit" }));

    await waitFor(() => expect(store.getState().orders).toEqual([]));
    expect(store.getState().history[0]).toMatchObject({ outcome: "paid" });
    expect(store.getState().history[0]?.order.payments).toEqual([expect.objectContaining({ method: "cash", amount: 20900 })]);
    expect(toast.success).toHaveBeenCalledWith("Ödeme tamamlandı");
    expect(await screen.findByRole("tab", { name: /^Salon\s*0\/2$/ })).toBeInTheDocument();
  });

  it("takes a partial payment with the method chosen, and leaves the rest due", async () => {
    const { user, store } = setup();
    await user.click(table("Masa 1"));
    await user.click(payButton());

    await typeAmount(user, "100");
    const dialog = within(await paymentDialog());
    expect(dialog.getByText("Ödenecek Tutar: ₺100,00")).toBeInTheDocument();
    await user.click(dialog.getByRole("button", { name: "Kredi Kartı" }));

    await waitFor(() => expect(dialog.getByText("Kalan").nextElementSibling).toHaveTextContent("₺109,00"));
    expect(store.getState().orders[0]?.payments).toEqual([expect.objectContaining({ method: "card", amount: 10000 })]);
    expect(dialog.getByRole("group", { name: "Tahsilat geçmişi" })).toHaveTextContent("Kredi Kartı₺100,00");
    expect(store.getState().history).toEqual([]);
  });

  it("finishes the balance after a partial payment, with each method on record", async () => {
    const { user, store } = setup();
    await user.click(table("Masa 1"));
    await user.click(payButton());
    await typeAmount(user, "100");
    await user.click(within(await paymentDialog()).getByRole("button", { name: "Kredi Kartı" }));
    await waitFor(() => expect(store.getState().orders[0]?.payments).toHaveLength(1));

    await user.click(within(await paymentDialog()).getByRole("button", { name: "Nakit" }));

    await waitFor(() => expect(store.getState().history).toHaveLength(1));
    expect(store.getState().history[0]?.order.payments.map((payment) => [payment.method, payment.amount])).toEqual([
      ["card", 10000],
      ["cash", 10900],
    ]);
  });

  it("gives change when cash is handed over above the amount due", async () => {
    const { user, store } = setup();
    await user.click(table("Masa 1"));
    await user.click(payButton());

    await typeAmount(user, "300");
    await user.click(within(await paymentDialog()).getByRole("button", { name: "Nakit" }));

    await waitFor(() => expect(store.getState().history).toHaveLength(1));
    expect(toast.success).toHaveBeenCalledWith("Para üstü: ₺91,00");
    expect(store.getState().history[0]?.order.payments[0]?.amount).toBe(20900);
  });

  it("does not let a card overpay", async () => {
    const { user, store } = setup();
    await user.click(table("Masa 1"));
    await user.click(payButton());

    await typeAmount(user, "300");
    await user.click(within(await paymentDialog()).getByRole("button", { name: "Kredi Kartı" }));

    expect(toast.error).toHaveBeenCalledWith("Tutar kalan tutarı aşamaz");
    expect(store.getState().orders[0]?.payments).toEqual([]);
    expect(await paymentDialog()).toBeInTheDocument();
  });

  it("pays for chosen lines and marks them paid", async () => {
    const { user, store } = setup();
    await user.click(table("Masa 1"));
    await user.click(payButton());
    const dialog = within(await paymentDialog());

    await user.click(dialog.getByRole("checkbox", { name: "Çay seç" }));
    expect(dialog.getByText("Ödenecek Tutar: ₺104,00")).toBeInTheDocument();
    await user.click(dialog.getByRole("button", { name: "Nakit" }));

    await waitFor(() => expect(dialog.getByText("Ödendi")).toBeInTheDocument());
    expect(store.getState().orders[0]?.payments[0]).toMatchObject({ amount: 10400, lineIds: ["l1"] });
    // Base UI marks a disabled checkbox with aria-disabled rather than the native attribute.
    expect(dialog.getByRole("checkbox", { name: "Çay seç" })).toHaveAttribute("aria-disabled", "true");
  });

  it("splits the amount due between people without losing a kuruş", async () => {
    const { user } = setup();
    await user.click(table("Masa 1"));
    await user.click(payButton());
    const dialog = within(await paymentDialog());

    await user.click(dialog.getByRole("button", { name: "1/n" }));

    expect(dialog.getByText("Ödenecek Tutar: ₺104,50")).toBeInTheDocument();
  });

  it("opens the discount dialog from the keypad", async () => {
    const { user } = setup();
    await user.click(table("Masa 1"));
    await user.click(payButton());

    await user.click(within(await paymentDialog()).getByRole("button", { name: "İndirim" }));

    expect(await screen.findByRole("dialog", { name: "İndirim" })).toBeInTheDocument();
  });

  it("takes the typed digits back with backspace and clear", async () => {
    const { user } = setup();
    await user.click(table("Masa 1"));
    await user.click(payButton());
    const dialog = within(await paymentDialog());

    await typeAmount(user, "12");
    await user.click(dialog.getByRole("button", { name: "Geri sil" }));
    expect(dialog.getByText("Ödenecek Tutar: ₺1,00")).toBeInTheDocument();
    await user.click(dialog.getByRole("button", { name: "Temizle" }));

    expect(dialog.getByText("Ödenecek Tutar: ₺209,00")).toBeInTheDocument();
  });

  it("asks before taking a fast cash payment", async () => {
    const { user, store } = setup();
    await user.click(table("Masa 1"));

    await user.click(screen.getByRole("button", { name: "HIZLI ÖDE" }));
    expect(await screen.findByRole("alertdialog")).toHaveTextContent("₺209,00 nakit tahsil edilip sipariş kapatılsın mı?");
    expect(store.getState().orders).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: "Nakit tahsil et" }));

    await waitFor(() => expect(store.getState().history).toHaveLength(1));
    expect(store.getState().history[0]?.order.payments[0]).toMatchObject({ method: "cash", amount: 20900 });
  });
});

describe("table quick actions", () => {
  const openQuick = async (user: User) => user.click(screen.getByRole("button", { name: "Hızlı işlemler: Masa 1" }));

  it("cancels a bill only after confirming, and keeps a record of it", async () => {
    const { user, store } = setup();

    await openQuick(user);
    await user.click(await screen.findByRole("button", { name: "İptal" }));
    expect(await screen.findByRole("alertdialog")).toHaveTextContent("Sipariş iptal edilsin mi?");
    expect(store.getState().orders).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: "İptal et" }));

    await waitFor(() => expect(store.getState().orders).toEqual([]));
    expect(store.getState().history[0]).toMatchObject({ outcome: "cancelled" });
  });

  it("moves a bill to a free table", async () => {
    const { user, store } = setup();

    await openQuick(user);
    await user.click(await screen.findByRole("button", { name: "Masayı Değiştir" }));
    await user.click(await screen.findByRole("combobox", { name: "Hedef masa" }));
    await user.click(await screen.findByRole("option", { name: "Salon · Masa 2" }));
    await user.click(screen.getByRole("button", { name: "Taşı" }));

    await waitFor(() => expect(store.getState().orders[0]?.tableId).toBe("t2"));
    expect(table("Masa 2")).toHaveTextContent("₺209,00");
  });

  it("says plainly which actions are not available yet", async () => {
    const { user } = setup();

    await openQuick(user);
    await user.click(await screen.findByRole("button", { name: "Yazdır" }));

    expect(toast.info).toHaveBeenCalledWith("Bu özellik henüz kullanılabilir değil.");
  });

  it("opens payment from the quick menu", async () => {
    const { user } = setup();

    await openQuick(user);
    await user.click(await screen.findByRole("button", { name: "Öde" }));

    expect(await paymentDialog()).toBeInTheDocument();
  });
});

describe("order board", () => {
  const openBoard = (user: User) => user.click(screen.getByRole("tab", { name: "Siparişler" }));
  const column = (name: string) => within(screen.getByRole("region", { name }));

  it("lists open orders in the column of their kitchen stage", async () => {
    const { user } = setup();

    await openBoard(user);

    expect(column("Hazırlanıyor").getByRole("article", { name: "Masa 1 siparişi" })).toHaveTextContent("₺209,00");
    expect(column("Bekleyen Siparişler").getByText("Sipariş yok")).toBeInTheDocument();
  });

  it("flags an order that has been preparing too long", async () => {
    const { user } = setup();

    await openBoard(user);

    expect(await column("Hazırlanıyor").findByText("Geciken Sipariş")).toBeInTheDocument();
  });

  it("moves an order along when it is marked ready", async () => {
    const { user, store } = setup();
    await openBoard(user);

    await user.click(screen.getByRole("button", { name: "Masa 1: Hazır işaretle" }));

    expect(store.getState().orders[0]?.stage).toBe("ready");
    expect(column("Bekleyen Siparişler").getByRole("article", { name: "Masa 1 siparişi" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Masa 1: Hazır işaretle" })).not.toBeInTheDocument();
  });

  it("sends a delivery order out once it is ready", async () => {
    const { user, store } = setup();
    await user.click(screen.getByRole("button", { name: "Paket" }));
    await user.click(screen.getByRole("button", { name: "Çay ekle" }));
    await user.click(screen.getByRole("button", { name: "Geri" }));
    await openBoard(user);

    await user.click(screen.getByRole("button", { name: "Paket Sipariş: Hazır işaretle" }));
    await user.click(screen.getByRole("button", { name: "Paket Sipariş: Teslimata çıkar" }));

    expect(store.getState().orders.find((order) => order.type === "delivery")?.stage).toBe("out_for_delivery");
    expect(column("Teslimata Çıkanlar").getByRole("article", { name: "Paket Sipariş siparişi" })).toBeInTheDocument();
  });

  it("filters the board as the user searches", async () => {
    const { user } = setup();
    await openBoard(user);

    await user.type(screen.getByRole("searchbox", { name: "Sipariş ara" }), "zzz");

    expect(screen.queryByRole("article", { name: "Masa 1 siparişi" })).not.toBeInTheDocument();
  });

  it("opens an order from its card", async () => {
    const { user } = setup();
    await openBoard(user);

    await user.click(screen.getByRole("button", { name: "Masa 1 adisyonunu aç" }));

    expect(screen.getByRole("heading", { name: "Masa 1" })).toBeInTheDocument();
  });

  it("cancels from the card's menu after confirming", async () => {
    const { user, store } = setup();
    await openBoard(user);

    await user.click(screen.getByRole("button", { name: "Masa 1 daha fazla" }));
    await user.click(await screen.findByRole("menuitem", { name: "Siparişi İptal Et" }));
    await user.click(await screen.findByRole("button", { name: "İptal et" }));

    await waitFor(() => expect(store.getState().history[0]).toMatchObject({ outcome: "cancelled" }));
  });

  it("does not list an order nothing was added to", async () => {
    const { user } = setup();
    await user.click(table("Masa 2"));
    await user.click(screen.getByRole("button", { name: "Geri" }));

    await openBoard(user);

    expect(screen.queryByRole("article", { name: "Masa 2 siparişi" })).not.toBeInTheDocument();
  });
});

describe("takeaway and delivery", () => {
  it("opens a takeaway bill from the rail", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Gel Al" }));

    expect(screen.getByRole("heading", { name: "Gel Al Sipariş" })).toBeInTheDocument();
  });

  it("drops a takeaway bill that was left empty", async () => {
    const { user, store } = setup();

    await user.click(screen.getByRole("button", { name: "Gel Al" }));
    expect(store.getState().orders).toHaveLength(2);
    await user.click(screen.getByRole("button", { name: "Geri" }));

    expect(store.getState().orders).toHaveLength(1);
  });
});
