import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { DashboardScreen } from "@/features/pos/components/dashboard-screen";
import type { DaySummary } from "@/features/pos/model/stats";
import { PosProvider, type PosSnapshot } from "@/features/pos/store/pos-provider";
import { buildDaySummary, buildPosSnapshot } from "../../../support/pos-fixtures";

const EMPTY_SNAPSHOT: PosSnapshot = { areas: [], tables: [], categories: [], products: [], orders: [] };

/** Today: 45,00 in cash at 15:05 and 367,00 by card at 16:10. Masa 1 (from buildPosSnapshot) has a 209,00 bill open. */
const TRADING_DAY: DaySummary = buildDaySummary({
  paidCount: 2,
  salesTotal: 41200,
  averageBill: 20600,
  byMethod: [
    { method: "card", amount: 36700, share: 89 },
    { method: "cash", amount: 4500, share: 11 },
  ],
  byHour: Array.from({ length: 24 }, (_, hour) => ({ hour, amount: hour === 15 ? 4500 : hour === 16 ? 36700 : 0 })),
  peakHour: { hour: 16, amount: 36700 },
});

function setup(day: DaySummary, snapshot: PosSnapshot = buildPosSnapshot()) {
  render(
    <PosProvider initial={snapshot}>
      <DashboardScreen day={day} />
    </PosProvider>
  );
}

const cardElement = (name: string) => screen.getByRole("group", { name });
const card = (name: string) => within(cardElement(name));

describe("DashboardScreen", () => {
  it("has a page heading and every section of the original layout", () => {
    setup(TRADING_DAY);

    expect(screen.getByRole("heading", { level: 1, name: "Ana Sayfa" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Genel Durum" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Finansal Analiz & Kârlılık" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Günlük Satış Miktarları" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Bugün Yapılan Ödemeler" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Masa Yoğunluğu (%)" })).toBeInTheDocument();
  });

  describe("Genel Durum", () => {
    it("shows today's sales and links to the end-of-day report", () => {
      setup(TRADING_DAY);

      expect(card("Bugünkü toplam satış tutarı").getByText("₺412,00")).toBeInTheDocument();
      expect(card("Bugünkü toplam satış tutarı").getByRole("link", { name: "Gün sonu raporu" })).toHaveAttribute("href", "/reports");
    });

    it("counts today's guests from the bills that were paid and what is still open", () => {
      setup(TRADING_DAY);

      // 2 paid today + 1 still open on the floor.
      expect(card("Bugün ağırlanan misafir sayısı").getByText("3")).toBeInTheDocument();
    });

    it("shows what is still open on the floor", () => {
      setup(TRADING_DAY);

      expect(card("Bugün açık sipariş toplamı").getByText("₺209,00")).toBeInTheDocument();
    });

    it("shows today's expenses from the day summary and links to Masraflar", () => {
      setup({ ...TRADING_DAY, expenseTotal: 12345 });

      expect(card("Bugünkü toplam gider tutarı").getByText("₺123,45")).toBeInTheDocument();
      expect(card("Bugünkü toplam gider tutarı").getByRole("link", { name: "Masraflar" })).toHaveAttribute("href", "/restaurant-expenses");
    });
  });

  describe("Finansal Analiz & Kârlılık", () => {
    it("works profit out of sales, cost of goods, expenses and fire", () => {
      setup({ ...TRADING_DAY, salesTotal: 41200, costOfGoods: 10000, expenseTotal: 5000, wastageTotal: 1200 });

      expect(card("Satılan Ürün Maliyeti").getByText("₺100,00")).toBeInTheDocument();
      expect(cardElement("Satılan Ürün Maliyeti")).toHaveTextContent("Gerçek Satış Maliyeti");
      expect(card("Brüt Kâr").getByText("₺312,00")).toBeInTheDocument();
      expect(cardElement("Brüt Kâr")).toHaveTextContent("Ciro - Satılan Ürün Maliyeti");
      expect(card("Net Kâr").getByText("₺250,00")).toBeInTheDocument();
      expect(cardElement("Net Kâr")).toHaveTextContent("Brüt Kâr - Gider - Zayi");
    });

    it("shows what the stock on hand is worth", () => {
      setup({ ...TRADING_DAY, stockValue: 45000 });

      expect(card("Toplam Stok Maliyeti").getByText("₺450,00")).toBeInTheDocument();
      expect(cardElement("Toplam Stok Maliyeti")).toHaveTextContent("Depodaki Ürün Maliyeti");
    });
  });

  describe("sales by hour", () => {
    it("names the busiest hour next to an accessible chart", () => {
      setup(TRADING_DAY);

      expect(screen.getByRole("img", { name: /Saatlik satış grafiği/ })).toBeInTheDocument();
      expect(screen.getByText("En yoğun saat: 16:00 (₺367,00)")).toBeInTheDocument();
    });

    it("says so when nothing was sold yet", () => {
      setup(buildDaySummary());

      expect(screen.getByText("Bugün henüz satış yapılmadı")).toBeInTheDocument();
    });
  });

  describe("payments today", () => {
    it("lists each method with what it took and its share, largest first", () => {
      setup(TRADING_DAY);

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
      setup(buildDaySummary());

      expect(screen.getByText("Henüz tamamlanan tahsilat bulunmuyor")).toBeInTheDocument();
      expect(screen.queryByRole("list", { name: "Ödeme yöntemleri" })).not.toBeInTheDocument();
    });
  });

  describe("table occupancy", () => {
    it("shows the share of tables in use", () => {
      setup(TRADING_DAY);

      expect(screen.getByRole("img", { name: "Masa doluluğu %33" })).toBeInTheDocument();
      expect(screen.getByText("Dolu Masalar: 1 adet (%33)")).toBeInTheDocument();
      expect(screen.getByText("Boş Masalar: 2 adet (%67)")).toBeInTheDocument();
    });

    it("points at the table setup when there are no tables", () => {
      setup(TRADING_DAY, EMPTY_SNAPSHOT);

      expect(screen.getByText("Tanımlı masa yok")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Masa / Bölge Tanımla" })).toHaveAttribute("href", "/table-area-definition");
    });
  });
});
