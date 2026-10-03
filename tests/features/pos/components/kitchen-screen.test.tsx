import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { KitchenScreen } from "@/features/pos/components/kitchen-screen";
import { addProduct, markReady, type Order } from "@/features/pos/model/order";
import { PosProvider, type PosSnapshot } from "@/features/pos/store/pos-provider";
import { useNow } from "@/features/pos/hooks/use-now";
import { buildPosSnapshot, minutesAgo } from "../../../support/pos-fixtures";

vi.mock("@/features/pos/hooks/use-now", () => ({ useNow: vi.fn() }));

const orderActions = vi.hoisted(() => ({ markReadyAction: vi.fn() }));
vi.mock("@/features/pos/server/order-actions", () => orderActions);

beforeEach(() => {
  orderActions.markReadyAction.mockReset();
});

function setup(initial: PosSnapshot = buildPosSnapshot()) {
  vi.mocked(useNow).mockReturnValue(new Date());
  render(
    <PosProvider initial={initial}>
      <KitchenScreen />
    </PosProvider>
  );
  return { user: userEvent.setup() };
}

const withOrder = (state: PosSnapshot, id: string, change: (order: Order) => Order): PosSnapshot => ({
  ...state,
  orders: state.orders.map((order) => (order.id === id ? change(order) : order)),
});

describe("KitchenScreen", () => {
  it("shows every open order that is still preparing, one ticket each", () => {
    setup();

    const ticket = screen.getByRole("article", { name: /Masa 1/ });
    expect(ticket).toHaveTextContent("2 x Çay");
    expect(ticket).toHaveTextContent("1 x Coca Cola");
    expect(ticket).toHaveTextContent("Ahmet");
  });

  it("says the kitchen is caught up when nothing is preparing", () => {
    const state = buildPosSnapshot();
    setup({ ...state, orders: state.orders.map((order) => markReady(order)) });

    expect(screen.getByText("Tüm mutfak siparişleri hazırlandı. Yeni sipariş bekleniyor...")).toBeInTheDocument();
  });

  it("marks an order ready and it leaves the board", async () => {
    const state = buildPosSnapshot();
    orderActions.markReadyAction.mockResolvedValue(markReady(state.orders[0]!));
    const { user } = setup(state);

    await user.click(screen.getByRole("button", { name: "Tümü Hazır" }));

    await waitFor(() => expect(screen.queryByRole("article", { name: /Masa 1/ })).not.toBeInTheDocument());
    expect(orderActions.markReadyAction).toHaveBeenCalledWith("o1");
  });

  it("shows an error toast when the server refuses", async () => {
    orderActions.markReadyAction.mockRejectedValue(new Error("İşlem yapılamadı"));
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Tümü Hazır" }));

    await waitFor(() => expect(screen.getByRole("article", { name: /Masa 1/ })).toBeInTheDocument());
  });

  it("marks a late order (over 15 minutes) so the kitchen can see it", () => {
    const state = buildPosSnapshot();
    const late = withOrder(state, "o1", (order) => ({ ...order, openedAt: minutesAgo(20) }));
    setup(late);

    expect(screen.getByRole("article", { name: /Masa 1/ })).toHaveTextContent("Geç kaldı");
  });

  it("ignores an order nothing has been added to yet", () => {
    const state = buildPosSnapshot();
    const empty: Order = { ...state.orders[0]!, id: "o2", number: 2, tableId: "t2", lines: [] };
    setup({ ...state, orders: [...state.orders, empty] });

    expect(screen.getAllByRole("article")).toHaveLength(1);
  });

  it("shows several tickets when several orders are preparing", () => {
    const state = buildPosSnapshot();
    const second: Order = { ...state.orders[0]!, id: "o2", number: 2, tableId: "t2" };
    const withSecond = withOrder({ ...state, orders: [...state.orders, second] }, "o2", (order) =>
      addProduct(order, { id: "p-cheese", name: "Cheesecake", price: 19500 }, "l9")
    );
    setup(withSecond);

    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(within(screen.getByRole("article", { name: /Masa 2/ })).getByText(/Cheesecake/)).toBeInTheDocument();
  });
});
