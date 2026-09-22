import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RightsScreen } from "@/features/users/components/rights-screen";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

beforeEach(() => toast.success.mockClear());

describe("RightsScreen", () => {
  it("has a heading and lists every permission as a row with a checkbox per role", () => {
    render(<RightsScreen />);

    expect(screen.getByRole("heading", { level: 1, name: "Yetki / İzin Ekranı" })).toBeInTheDocument();
    const row = screen.getByRole("row", { name: /Masa ve Bölge İşlemleri/ });
    expect(within(row).getAllByRole("checkbox")).toHaveLength(6);
  });

  it("starts from the grants it is given", () => {
    render(<RightsScreen initialGrants={{ table_area: { Müdür: true } }} />);

    const row = screen.getByRole("row", { name: /Masa ve Bölge İşlemleri/ });
    expect(within(row).getByRole("checkbox", { name: "Müdür" })).toBeChecked();
    expect(within(row).getByRole("checkbox", { name: "Garson" })).not.toBeChecked();
  });

  it("toggles a cell and saves the whole grid", async () => {
    const user = userEvent.setup();
    render(<RightsScreen />);

    const row = screen.getByRole("row", { name: /Masa ve Bölge İşlemleri/ });
    await user.click(within(row).getByRole("checkbox", { name: "Garson" }));
    expect(within(row).getByRole("checkbox", { name: "Garson" })).toBeChecked();

    await user.click(screen.getByRole("button", { name: "Kaydet" }));

    expect(toast.success).toHaveBeenCalledWith("Yetkiler kaydedildi");
  });

  it("searches permissions by title or description", async () => {
    const user = userEvent.setup();
    render(<RightsScreen />);

    await user.type(screen.getByRole("searchbox", { name: "Yetki ara" }), "stok sayımı");

    expect(screen.getByRole("row", { name: /Stok girişi/ })).toBeInTheDocument();
    expect(screen.queryByRole("row", { name: /Masa ve Bölge İşlemleri/ })).not.toBeInTheDocument();
  });

  it("says nothing matched the search", async () => {
    const user = userEvent.setup();
    render(<RightsScreen />);

    await user.type(screen.getByRole("searchbox", { name: "Yetki ara" }), "zzz");

    expect(screen.getByText("Aranan kriterlere uygun yetki bulunamadı.")).toBeInTheDocument();
  });
});
