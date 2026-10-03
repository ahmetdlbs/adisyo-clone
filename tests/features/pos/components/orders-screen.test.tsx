import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OrdersScreen } from "@/features/pos/components/orders-screen";
import {
  addProduct,
  applyPayment,
  decrementProduct,
  dispatchDelivery,
  markReady,
  removeLine,
  resetOrder,
  setDiscountPercent,
  toggleComplimentary,
  type Order,
  type OrderType,
  type PaymentRequest,
} from "@/features/pos/model/order";
import { defaultPortion, portionPrice, type Product } from "@/features/pos/model/pos-state";
import { PosProvider, type PosSnapshot } from "@/features/pos/store/pos-provider";
import { buildPosSnapshot } from "../../../support/pos-fixtures";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

const actions = vi.hoisted(() => ({
  openOrderAction: vi.fn(),
  addProductAction: vi.fn(),
  decrementProductAction: vi.fn(),
  removeLineAction: vi.fn(),
  toggleComplimentaryAction: vi.fn(),
  resetOrderAction: vi.fn(),
  setDiscountAction: vi.fn(),
  setChargesAction: vi.fn(),
  applyPaymentAction: vi.fn(),
  closeOrderAction: vi.fn(),
  cancelOrderAction: vi.fn(),
  discardEmptyOrderAction: vi.fn(),
  moveOrderToTableAction: vi.fn(),
  markReadyAction: vi.fn(),
  dispatchDeliveryAction: vi.fn(),
}));
vi.mock("@/features/pos/server/order-actions", () => actions);

const customerActions = vi.hoisted(() => ({ fetchCustomers: vi.fn() }));
vi.mock("@/features/customers/server/customer-actions", () => customerActions);

beforeEach(() => {
  toast.success.mockClear();
  toast.error.mockClear();
  toast.info.mockClear();
  Object.values(actions).forEach((mock) => mock.mockReset());
  customerActions.fetchCustomers.mockReset().mockResolvedValue([]);
});

/**
 * A tiny fake of api/'s orders endpoints, built on the same pure rules from `model/order.ts` that the real
 * NestJS service ports its own logic from (`api/src/orders/order-calc.ts`). This keeps the test exercising real
 * business rules end to end while mocking only the network boundary, exactly like the store's own contract.
 */
function fakeOrdersApi(initial: PosSnapshot) {
  const orders = new Map(initial.orders.map((order) => [order.id, order]));
  const products = new Map(initial.products.map((product) => [product.id, product]));
  let sequence = orders.size;
  const nextId = () => `gen-${++sequence}`;

  const get = (id: string): Order => {
    const order = orders.get(id);
    if (!order) throw new Error("Sipariş bulunamadı");
    return order;
  };
  const put = (order: Order): Order => {
    orders.set(order.id, order);
    return order;
  };
  const productOf = (id: string): Product => {
    const product = products.get(id);
    if (!product) throw new Error("Ürün bulunamadı");
    return product;
  };

  actions.openOrderAction.mockImplementation(
    async (input: { type: OrderType; tableId: string | null; customerName?: string; waiter: string }) =>
      put({
        id: nextId(),
        number: orders.size + 1,
        type: input.type,
        tableId: input.tableId,
        ...(input.customerName ? { customerName: input.customerName } : {}),
        waiter: input.waiter,
        openedAt: new Date().toISOString(),
        stage: "preparing",
        status: "open",
        closedAt: null,
        lines: [],
        discountPercent: 0,
        payments: [],
      })
  );
  actions.addProductAction.mockImplementation(async (orderId: string, productId: string, portionId: string) => {
    const order = get(orderId);
    const product = productOf(productId);
    const portion = product.portions.find((candidate) => candidate.id === portionId) ?? defaultPortion(product);
    if (!portion) throw new Error("Porsiyon bulunamadı");
    return put(addProduct(order, { id: product.id, name: product.name, price: portionPrice(portion, order.type) }, nextId(), portion.id));
  });
  actions.decrementProductAction.mockImplementation(async (orderId: string, productId: string, portionId: string) =>
    put(decrementProduct(get(orderId), productId, portionId))
  );
  actions.removeLineAction.mockImplementation(async (orderId: string, lineId: string) => put(removeLine(get(orderId), lineId)));
  actions.toggleComplimentaryAction.mockImplementation(async (orderId: string, lineId: string) => put(toggleComplimentary(get(orderId), lineId)));
  actions.resetOrderAction.mockImplementation(async (orderId: string) => put(resetOrder(get(orderId))));
  actions.setDiscountAction.mockImplementation(async (orderId: string, percent: number) => put(setDiscountPercent(get(orderId), percent)));
  actions.applyPaymentAction.mockImplementation(async (orderId: string, request: PaymentRequest) => {
    const result = applyPayment(get(orderId), request, { paymentId: nextId(), now: new Date() });
    put(result.order);
    return result;
  });
  actions.closeOrderAction.mockImplementation(async (orderId: string) => get(orderId));
  actions.cancelOrderAction.mockImplementation(async (orderId: string) => get(orderId));
  actions.discardEmptyOrderAction.mockImplementation(async (orderId: string) => {
    const order = get(orderId);
    if (order.lines.length === 0 && order.payments.length === 0) orders.delete(orderId);
  });
  actions.moveOrderToTableAction.mockImplementation(async (orderId: string, tableId: string) => put({ ...get(orderId), tableId }));
  actions.markReadyAction.mockImplementation(async (orderId: string) => put(markReady(get(orderId))));
  actions.dispatchDeliveryAction.mockImplementation(async (orderId: string) => put(dispatchDelivery(get(orderId))));

  return { orders };
}

function setup() {
  const initial = buildPosSnapshot();
  const api = fakeOrdersApi(initial);
  render(
    <PosProvider initial={initial}>
      <OrdersScreen />
    </PosProvider>
  );
  return { api, user: userEvent.setup() };
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
    const { user, api } = setup();

    await user.click(table("Masa 2"));
    expect(screen.getByRole("heading", { name: "Masa 2" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Geri" }));

    await waitFor(() => expect(actions.discardEmptyOrderAction).toHaveBeenCalled());
    expect(api.orders.size).toBe(1);
    expect(table("Masa 2")).toBeInTheDocument();
  });
});

describe("editing a bill", () => {
  it("adds products and shows them on the ticket", async () => {
    const { user } = setup();
    await user.click(table("Masa 2"));

    await user.click(screen.getByRole("button", { name: "Çay ekle" }));

    expect(await ticket().findByText("1 × ₺52,00")).toBeInTheDocument();
    expect(totalOf()).toHaveTextContent("₺52,00");
    expect(within(screen.getByRole("group", { name: "Çay" })).getByText("1")).toBeInTheDocument();
  });

  it("raises and lowers the quantity, and stays open when the last item is taken off", async () => {
    const { user } = setup();
    await user.click(table("Masa 2"));

    await user.click(screen.getByRole("button", { name: "Çay ekle" }));
    await user.click(await screen.findByRole("button", { name: "Çay arttır" }));
    await waitFor(() => expect(totalOf()).toHaveTextContent("₺104,00"));
    await user.click(screen.getByRole("button", { name: "Çay azalt" }));
    await user.click(screen.getByRole("button", { name: "Çay azalt" }));

    await waitFor(() => expect(ticket().getByText(/Adisyon boş/)).toBeInTheDocument());
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

    await waitFor(() => expect(totalOf()).toHaveTextContent("₺105,00"));
    expect(ticket().getByText("İkram")).toBeInTheDocument();
  });

  it("removes a line", async () => {
    const { user } = setup();
    await user.click(table("Masa 1"));

    await user.click(screen.getByRole("button", { name: "Coca Cola işlemleri" }));
    await user.click(await screen.findByRole("menuitem", { name: "Sil" }));

    await waitFor(() => expect(ticket().queryByText("Coca Cola")).not.toBeInTheDocument());
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
    expect(actions.setDiscountAction).not.toHaveBeenCalled();
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
    const { user } = setup();
    await user.click(table("Masa 1"));
    await user.click(payButton());

    await user.click(within(await paymentDialog()).getByRole("button", { name: "Nakit" }));

    await waitFor(() => expect(actions.closeOrderAction).toHaveBeenCalledWith("o1"));
    expect(actions.applyPaymentAction).toHaveBeenCalledWith("o1", expect.objectContaining({ method: "cash", tendered: 20900 }));
    expect(toast.success).toHaveBeenCalledWith("Ödeme tamamlandı");
    expect(await screen.findByRole("tab", { name: /^Salon\s*0\/2$/ })).toBeInTheDocument();
  });

  it("takes a partial payment with the method chosen, and leaves the rest due", async () => {
    const { user } = setup();
    await user.click(table("Masa 1"));
    await user.click(payButton());

    await typeAmount(user, "100");
    const dialog = within(await paymentDialog());
    expect(dialog.getByText("Ödenecek Tutar: ₺100,00")).toBeInTheDocument();
    await user.click(dialog.getByRole("button", { name: "Kredi Kartı" }));

    await waitFor(() => expect(dialog.getByText("Kalan").nextElementSibling).toHaveTextContent("₺109,00"));
    expect(dialog.getByRole("group", { name: "Tahsilat geçmişi" })).toHaveTextContent("Kredi Kartı₺100,00");
    expect(actions.closeOrderAction).not.toHaveBeenCalled();
  });

  it("finishes the balance after a partial payment, with each method on record", async () => {
    const { user } = setup();
    await user.click(table("Masa 1"));
    await user.click(payButton());
    await typeAmount(user, "100");
    await user.click(within(await paymentDialog()).getByRole("button", { name: "Kredi Kartı" }));
    const dialog = within(await paymentDialog());
    await waitFor(() => expect(dialog.getByText("Kalan").nextElementSibling).toHaveTextContent("₺109,00"));

    await user.click(within(await paymentDialog()).getByRole("button", { name: "Nakit" }));

    await waitFor(() => expect(actions.closeOrderAction).toHaveBeenCalledWith("o1"));
    expect(actions.applyPaymentAction.mock.calls.map((call) => [(call[1] as { method: string }).method])).toEqual([["card"], ["cash"]]);
  });

  it("charges a veresiye payment to the customer picked for it", async () => {
    customerActions.fetchCustomers.mockResolvedValue([{ id: "c1", no: 1, firstName: "Veli", lastName: "Yıldız", phone: "0555", phone2: "", balance: 0 }]);
    const { user } = setup();
    await user.click(table("Masa 1"));
    await user.click(payButton());

    await user.click(within(await paymentDialog()).getByRole("button", { name: "Ödenmez" }));
    const picker = within(await screen.findByRole("group", { name: "Veresiye müşterisi" }));
    await user.click(picker.getByRole("combobox", { name: "Müşteri" }));
    await user.click(await screen.findByRole("option", { name: "Veli Yıldız" }));
    await user.click(picker.getByRole("button", { name: "Hesaba Yaz" }));

    await waitFor(() => expect(actions.applyPaymentAction).toHaveBeenCalled());
    expect(actions.applyPaymentAction.mock.calls[0]?.[1]).toMatchObject({ method: "on_account", customerId: "c1" });
  });

  it("takes Ödenmez straight away when there is no customer to charge", async () => {
    const { user } = setup();
    await user.click(table("Masa 1"));
    await user.click(payButton());

    await user.click(within(await paymentDialog()).getByRole("button", { name: "Ödenmez" }));

    await waitFor(() => expect(actions.applyPaymentAction).toHaveBeenCalled());
    expect(actions.applyPaymentAction.mock.calls[0]?.[1]).not.toHaveProperty("customerId");
  });

  it("gives change when cash is handed over above the amount due", async () => {
    const { user } = setup();
    await user.click(table("Masa 1"));
    await user.click(payButton());

    await typeAmount(user, "300");
    await user.click(within(await paymentDialog()).getByRole("button", { name: "Nakit" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Para üstü: ₺91,00"));
    expect(actions.applyPaymentAction).toHaveBeenCalledWith("o1", expect.objectContaining({ tendered: 30000 }));
  });

  it("does not let a card overpay", async () => {
    const { user } = setup();
    await user.click(table("Masa 1"));
    await user.click(payButton());

    await typeAmount(user, "300");
    await user.click(within(await paymentDialog()).getByRole("button", { name: "Kredi Kartı" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Tutar kalan tutarı aşamaz"));
    expect(actions.closeOrderAction).not.toHaveBeenCalled();
    expect(await paymentDialog()).toBeInTheDocument();
  });

  it("pays for chosen lines and marks them paid", async () => {
    const { user } = setup();
    await user.click(table("Masa 1"));
    await user.click(payButton());
    const dialog = within(await paymentDialog());

    await user.click(dialog.getByRole("checkbox", { name: "Çay seç" }));
    expect(dialog.getByText("Ödenecek Tutar: ₺104,00")).toBeInTheDocument();
    await user.click(dialog.getByRole("button", { name: "Nakit" }));

    await waitFor(() => expect(dialog.getByText("Ödendi")).toBeInTheDocument());
    expect(actions.applyPaymentAction).toHaveBeenCalledWith("o1", expect.objectContaining({ tendered: 10400, lineIds: ["l1"] }));
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
    const { user } = setup();
    await user.click(table("Masa 1"));

    await user.click(screen.getByRole("button", { name: "HIZLI ÖDE" }));
    expect(await screen.findByRole("alertdialog")).toHaveTextContent("₺209,00 nakit tahsil edilip sipariş kapatılsın mı?");
    expect(actions.applyPaymentAction).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Nakit tahsil et" }));

    await waitFor(() => expect(actions.closeOrderAction).toHaveBeenCalledWith("o1"));
    expect(actions.applyPaymentAction).toHaveBeenCalledWith("o1", expect.objectContaining({ method: "cash", tendered: 20900 }));
  });
});

describe("table quick actions", () => {
  const openQuick = async (user: User) => user.click(screen.getByRole("button", { name: "Hızlı işlemler: Masa 1" }));

  it("cancels a bill only after confirming, and keeps a record of it", async () => {
    const { user } = setup();

    await openQuick(user);
    await user.click(await screen.findByRole("button", { name: "İptal" }));
    expect(await screen.findByRole("alertdialog")).toHaveTextContent("Sipariş iptal edilsin mi?");
    expect(actions.cancelOrderAction).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "İptal et" }));

    await waitFor(() => expect(actions.cancelOrderAction).toHaveBeenCalledWith("o1"));
    expect(toast.success).toHaveBeenCalledWith("Sipariş iptal edildi");
  });

  it("moves a bill to a free table", async () => {
    const { user } = setup();

    await openQuick(user);
    await user.click(await screen.findByRole("button", { name: "Masayı Değiştir" }));
    await user.click(await screen.findByRole("combobox", { name: "Hedef masa" }));
    await user.click(await screen.findByRole("option", { name: "Salon · Masa 2" }));
    await user.click(screen.getByRole("button", { name: "Taşı" }));

    await waitFor(() => expect(table("Masa 2")).toHaveTextContent("₺209,00"));
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
    const { user } = setup();
    await openBoard(user);

    await user.click(screen.getByRole("button", { name: "Masa 1: Hazır işaretle" }));

    await waitFor(() => expect(column("Bekleyen Siparişler").getByRole("article", { name: "Masa 1 siparişi" })).toBeInTheDocument());
    expect(screen.queryByRole("button", { name: "Masa 1: Hazır işaretle" })).not.toBeInTheDocument();
  });

  it("sends a delivery order out once it is ready", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "Paket" }));
    await user.click(screen.getByRole("button", { name: "Çay ekle" }));
    await user.click(screen.getByRole("button", { name: "Geri" }));
    await openBoard(user);

    await user.click(screen.getByRole("button", { name: "Paket Sipariş: Hazır işaretle" }));
    await user.click(await screen.findByRole("button", { name: "Paket Sipariş: Teslimata çıkar" }));

    await waitFor(() => expect(column("Teslimata Çıkanlar").getByRole("article", { name: "Paket Sipariş siparişi" })).toBeInTheDocument());
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
    const { user } = setup();
    await openBoard(user);

    await user.click(screen.getByRole("button", { name: "Masa 1 daha fazla" }));
    await user.click(await screen.findByRole("menuitem", { name: "Siparişi İptal Et" }));
    await user.click(await screen.findByRole("button", { name: "İptal et" }));

    await waitFor(() => expect(actions.cancelOrderAction).toHaveBeenCalledWith("o1"));
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

    expect(await screen.findByRole("heading", { name: "Gel Al Sipariş" })).toBeInTheDocument();
  });

  it("drops a takeaway bill that was left empty", async () => {
    const { user, api } = setup();

    await user.click(screen.getByRole("button", { name: "Gel Al" }));
    await screen.findByRole("heading", { name: "Gel Al Sipariş" });
    expect(api.orders.size).toBe(2);
    await user.click(screen.getByRole("button", { name: "Geri" }));

    await waitFor(() => expect(actions.discardEmptyOrderAction).toHaveBeenCalled());
    expect(api.orders.size).toBe(1);
  });
});

describe("service charges", () => {
  it("shows the kuver on the bill and takes it off through the Servis ücreti menu", async () => {
    const { user } = setup();
    const bill = buildPosSnapshot().orders[0]!;
    const withKuver = { ...bill, charges: [{ which: "kuver" as const, name: "Kuver", kind: "amount" as const, amount: 2500 }] };
    actions.setChargesAction.mockResolvedValueOnce(withKuver).mockResolvedValueOnce(bill);
    await user.click(table("Masa 1"));

    await user.click(screen.getByRole("button", { name: "Servis ücreti" }));
    await user.click(await screen.findByRole("menuitem", { name: "Kuver ekle" }));

    await waitFor(() => expect(actions.setChargesAction).toHaveBeenCalledWith("o1", { kuver: true, garsoniye: false }));
    expect(await ticket().findByText("Kuver")).toBeInTheDocument();
    expect(totalOf()).toHaveTextContent("₺234,00");

    await user.click(screen.getByRole("button", { name: "Servis ücreti" }));
    await user.click(await screen.findByRole("menuitem", { name: "Kuveri kaldır" }));

    await waitFor(() => expect(actions.setChargesAction).toHaveBeenLastCalledWith("o1", { kuver: false, garsoniye: false }));
  });

  it("tells the cashier when a charge is not defined in the settings", async () => {
    actions.setChargesAction.mockRejectedValue(new Error("Garsoniye tanımlı değil"));
    const { user } = setup();
    await user.click(table("Masa 1"));

    await user.click(screen.getByRole("button", { name: "Servis ücreti" }));
    await user.click(await screen.findByRole("menuitem", { name: "Garsoniye ekle" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Garsoniye tanımlı değil"));
  });
});
