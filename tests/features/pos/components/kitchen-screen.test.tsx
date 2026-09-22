import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { KitchenScreen } from "@/features/pos/components/kitchen-screen";
import { addProduct, markReady } from "@/features/pos/model/order";
import { updateOrder, type PosState } from "@/features/pos/model/pos-state";
import { createPosStore, PosProvider } from "@/features/pos/store/pos-provider";
import { useNow } from "@/features/pos/hooks/use-now";
import { buildPosState, minutesAgo } from "../../../support/pos-fixtures";

vi.mock("@/features/pos/hooks/use-now", () => ({ useNow: vi.fn() }));

function setup(initial: PosState = buildPosState()) {
  vi.mocked(useNow).mockReturnValue(new Date());
  const store = createPosStore({ initial, storage: null });
  render(
    <PosProvider store={store}>
      <KitchenScreen />
    </PosProvider>
  );
  return { store, user: userEvent.setup() };
}

describe("KitchenScreen", () => {
  it("shows every open order that is still preparing, one ticket each", () => {
    setup();

    const ticket = screen.getByRole("article", { name: /Masa 1/ });
    expect(ticket).toHaveTextContent("2 x Çay");
    expect(ticket).toHaveTextContent("1 x Coca Cola");
    expect(ticket).toHaveTextContent("Ahmet");
  });

  it("says the kitchen is caught up when nothing is preparing", () => {
    const state = buildPosState();
    setup({ ...state, orders: state.orders.map((order) => markReady(order)) });

    expect(screen.getByText("Tüm mutfak siparişleri hazırlandı. Yeni sipariş bekleniyor...")).toBeInTheDocument();
  });

  it("marks an order ready and it leaves the board", async () => {
    const { user, store } = setup();

    await user.click(screen.getByRole("button", { name: "Tümü Hazır" }));

    await waitFor(() => expect(screen.queryByRole("article", { name: /Masa 1/ })).not.toBeInTheDocument());
    expect(store.getState().orders[0]?.stage).toBe("ready");
  });

  it("marks a late order (over 15 minutes) so the kitchen can see it", () => {
    const state = buildPosState();
    const late = updateOrder(state, "o1", (order) => ({ ...order, openedAt: minutesAgo(20) }));
    setup(late);

    expect(screen.getByRole("article", { name: /Masa 1/ })).toHaveTextContent("Geç kaldı");
  });

  it("ignores an order nothing has been added to yet", () => {
    const state = buildPosState();
    const empty = { ...state.orders[0]!, id: "o2", number: 2, tableId: "t2", lines: [] };
    setup({ ...state, orders: [...state.orders, empty] });

    expect(screen.getAllByRole("article")).toHaveLength(1);
  });

  it("shows several tickets when several orders are preparing", () => {
    const state = buildPosState();
    const withSecond = updateOrder(
      { ...state, orders: [...state.orders, { ...state.orders[0]!, id: "o2", number: 2, tableId: "t2" }] },
      "o2",
      (order) => addProduct(order, { id: "p-cheese", name: "Cheesecake", price: 19500 }, "l9")
    );
    setup(withSecond);

    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(within(screen.getByRole("article", { name: /Masa 2/ })).getByText(/Cheesecake/)).toBeInTheDocument();
  });
});
