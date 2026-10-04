import { describe, expect, it } from "vitest";
import { NAVIGATION, isNavGroup, visibleNavigation, type NavEntry } from "@/config/navigation";
import { ALL_APP_KEYS } from "../support/active-apps-state";

const labels = (entries: readonly NavEntry[]) => entries.map((entry) => entry.label);
const childLabels = (entries: readonly NavEntry[], group: string) => {
  const found = entries.find((entry) => entry.label === group);
  return found && isNavGroup(found) ? found.children.map((child) => child.label) : [];
};

describe("visibleNavigation", () => {
  it("hides every store module a restaurant has not bought, and keeps the core screens", () => {
    const entries = visibleNavigation(NAVIGATION, new Set());

    expect(labels(entries)).toEqual(expect.arrayContaining(["Ana Sayfa", "Sipariş", "Uygulama Mağazası"]));
    expect(labels(entries)).not.toContain("Mutfak");
    expect(labels(entries)).not.toContain("Entegrasyon İşlemleri");
    expect(labels(entries)).not.toContain("Yazıcılar");
    expect(childLabels(entries, "Raporlar")).not.toContain("Rapor Sihirbazı");
  });

  it("shows the kitchen and the report wizard once their apps are active", () => {
    const entries = visibleNavigation(NAVIGATION, new Set(["mutfak-ekrani", "ileri-raporlama-sihirbazi"]));

    expect(labels(entries)).toContain("Mutfak");
    expect(childLabels(entries, "Raporlar")).toContain("Rapor Sihirbazı");
  });

  it("opens the integrations group for any one delivery app", () => {
    for (const key of ["yemeksepeti-entegrasyonu", "trendyol-yemek-entegrasyonu"]) {
      const entries = visibleNavigation(NAVIGATION, new Set([key]));

      expect(childLabels(entries, "Entegrasyon İşlemleri")).toEqual(["Bağlantılar", "Menü Operasyonları", "Ürün Eşleştirme"]);
    }
  });

  it("drops a group that is left without children", () => {
    const entries = visibleNavigation(
      [{ label: "G", icon: NAVIGATION[0]!.icon!, children: [{ label: "X", requires: ["nope"] }] }],
      new Set()
    );

    expect(entries).toEqual([]);
  });

  it("shows everything when every app is active", () => {
    const entries = visibleNavigation(NAVIGATION, new Set(ALL_APP_KEYS));

    expect(labels(entries)).toEqual(expect.arrayContaining(["Mutfak", "Yazıcılar", "Dijital Menü", "Entegrasyon İşlemleri"]));
  });
});
