import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { DashboardScreen } from "@/features/pos/components/dashboard-screen";
import { useNow } from "@/features/pos/hooks/use-now";
import { createEmptyPosState, type PosState } from "@/features/pos/model/pos-state";
import { createPosStore, PosProvider } from "@/features/pos/store/pos-provider";
import { billLine, billPayment, buildClosedOrder, buildPosState, localTime } from "../../../support/pos-fixtures";

vi.mock("@/features/pos/hooks/use-now", () => ({ useNow: vi.fn() }));

beforeEach(() => {
  vi.mocked(useNow).mockReturnValue(localTime(20));
});

/** Masa 1 has a 209,00 bill open. Today: 45,00 in cash at 15:05 and 367,00 by card at 16:10, one 80,00 bill cancelled; yesterday's sale must not count. */
function tradingDay(): PosState {
  return {
    ...buildPosState(),
    history: [
      buildClosedOrder({ id: "h1", closedAt: localTime(15, 5), lines: [billLine("a", 4500)] }),
      buildClosedOrder({
        id: "h2",
        closedAt: localTime(16, 10),
        lines: [billLine("b", 36700)],
        payments: [billPayment("card", 36700, localTime(16, 10))],
      }),
      buildClosedOrder({ id: "h3", closedAt: localTime(17), lines: [billLine("c", 8000)], payments: [], outcome: "cancelled" }),
      buildClosedOrder({ id: "old", closedAt: localTime(12, 0, 20), lines: [billLine("d", 99900)] }),
    ],
  };
}

function setup(initial: PosState) {
  render(
    <PosProvider store={createPosStore({ initial, storage: null })}>
      <DashboardScreen />
    </PosProvider>
  );
}

const cardElement = (name: string) => screen.getByRole("group", { name });
const card = (name: string) => within(cardElement(name));

describe("DashboardScreen", () => {
  it("has a page heading and every section of the original layout", () => {
    setup(tradingDay());

    expect(screen.getByRole("heading", { level: 1, name: "Ana Sayfa" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Genel Durum" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Finansal Analiz & Kârlılık" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Günlük Satış Miktarları" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Bugün Yapılan Ödemeler" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Masa Yoğunluğu (%)" })).toBeInTheDocument();
  });

  describe("Genel Durum", () => {
    it("shows today's sales and links to the end-of-day report", () => {
      setup(tradingDay());

      expect(card("Bugünkü toplam satış tutarı").getByText("₺412,00")).toBeInTheDocument();
      expect(card("Bugünkü toplam satış tutarı").getByRole("link", { name: "Gün sonu raporu" })).toHaveAttribute("href", "/reports");
    });

    it("counts today's guests from the bills that were opened", () => {
      setup(tradingDay());

      // 2 closed + 1 still open on the floor.
      expect(card("Bugün ağırlanan misafir sayısı").getByText("3")).toBeInTheDocument();
    });

    it("shows what is still open on the floor", () => {
      setup(tradingDay());

      expect(card("Bugün açık sipariş toplamı").getByText("₺209,00")).toBeInTheDocument();
    });

    it("shows today's expenses and links to Masraflar, honestly at zero since nothing tracks them yet", () => {
      setup(tradingDay());

      expect(card("Bugünkü toplam gider tutarı").getByText("₺0,00")).toBeInTheDocument();
      expect(card("Bugünkü toplam gider tutarı").getByRole("link", { name: "Masraflar" })).toHaveAttribute("href", "/restaurant-expenses");
    });
  });

  describe("Finansal Analiz & Kârlılık", () => {
    it("shows all four cards, honestly at zero since no product carries a cost yet", () => {
      setup(tradingDay());

      expect(card("Toplam Stok Maliyeti").getByText("₺0,00")).toBeInTheDocument();
      expect(cardElement("Toplam Stok Maliyeti")).toHaveTextContent("Depodaki Ürün Maliyeti");
      expect(card("Satılan Ürün Maliyeti").getByText("₺0,00")).toBeInTheDocument();
      expect(cardElement("Satılan Ürün Maliyeti")).toHaveTextContent("Gerçek Satış Maliyeti");
      expect(card("Brüt Kâr").getByText("₺0,00")).toBeInTheDocument();
      expect(cardElement("Brüt Kâr")).toHaveTextContent("Ciro - Satılan Ürün Maliyeti");
      expect(card("Net Kâr").getByText("₺0,00")).toBeInTheDocument();
      expect(cardElement("Net Kâr")).toHaveTextContent("Brüt Kâr - Giderler");
    });
  });

  describe("sales by hour", () => {
    it("names the busiest hour next to an accessible chart", () => {
      setup(tradingDay());

      expect(screen.getByRole("img", { name: /Saatlik satış grafiği/ })).toBeInTheDocument();
      expect(screen.getByText("En yoğun saat: 16:00 (₺367,00)")).toBeInTheDocument();
    });

    it("says so when nothing was sold yet", () => {
      setup({ ...buildPosState(), history: [] });

      expect(screen.getByText("Bugün henüz satış yapılmadı")).toBeInTheDocument();
    });
  });

  describe("payments today", () => {
    it("lists each method with what it took and its share, largest first", () => {
      setup(tradingDay());

      const rows = within(screen.getByRole("list", { name: "Ödeme yöntemleri" })).getAllByRole("listitem");

      expect(rows).toHaveLength(2);
      expect(rows[0]).toHaveTextContent("Kredi Kartı");
      expect(rows[0]).toHaveTextContent("₺367,00");
      expect(rows[0]).toHaveTextContent("%89");
      expect(rows[1]).toHaveTextContent("Nakit");
      expect(rows[1]).toHaveTextContent("₺45,00");
      expect(rows[1]).toHaveTextContent("%11");
    });

    it("explains the empty state", () => {
      setup({ ...buildPosState(), history: [] });

      expect(screen.getByText("Henüz tamamlanan tahsilat bulunmuyor")).toBeInTheDocument();
      expect(screen.queryByRole("list", { name: "Ödeme yöntemleri" })).not.toBeInTheDocument();
    });
  });

  describe("table occupancy", () => {
    it("shows the share of tables in use", () => {
      setup(tradingDay());

      expect(screen.getByRole("img", { name: "Masa doluluğu %33" })).toBeInTheDocument();
      expect(screen.getByText("Dolu Masalar: 1 adet (%33)")).toBeInTheDocument();
      expect(screen.getByText("Boş Masalar: 2 adet (%67)")).toBeInTheDocument();
    });

    it("points at the table setup when there are no tables", () => {
      setup(createEmptyPosState());

      expect(screen.getByText("Tanımlı masa yok")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Masa / Bölge Tanımla" })).toHaveAttribute("href", "/table-area-definition");
    });
  });

  it("holds back the figures that depend on the clock until it is known, so the server HTML never disagrees with the browser", () => {
    vi.mocked(useNow).mockReturnValue(null);

    setup(tradingDay());

    expect(screen.getAllByTestId("stat-skeleton").length).toBeGreaterThan(0);
    expect(screen.queryByText("₺412,00")).not.toBeInTheDocument();
    expect(card("Bugün açık sipariş toplamı").getByText("₺209,00")).toBeInTheDocument();
  });
});
