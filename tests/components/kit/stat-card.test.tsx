import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Wallet } from "lucide-react";
import { StatCard } from "@/components/kit/stat-card";

describe("StatCard", () => {
  it("names the card after its label and shows the value in it", () => {
    render(<StatCard icon={Wallet} label="Bugünkü satış" value="₺389,00" />);

    const card = screen.getByRole("group", { name: "Bugünkü satış" });

    expect(within(card).getByText("Bugünkü satış")).toBeInTheDocument();
    expect(card).toHaveTextContent("₺389,00");
  });

  it("shows the footer line when there is one", () => {
    render(<StatCard icon={Wallet} label="Açık sipariş" value="₺209,00" footer="1 açık adisyon" />);

    expect(screen.getByText("1 açık adisyon")).toBeInTheDocument();
  });

  it("leaves the footer out when there is none", () => {
    render(<StatCard icon={Wallet} label="Açık sipariş" value="₺209,00" />);

    expect(screen.queryByTestId("stat-card-footer")).not.toBeInTheDocument();
  });

  it("accepts any node as the value, e.g. a placeholder while data loads", () => {
    render(<StatCard icon={Wallet} label="Bugünkü satış" value={<span role="status">Yükleniyor</span>} />);

    expect(screen.getByRole("status")).toHaveTextContent("Yükleniyor");
  });

  it("hides the decorative icon from assistive tech", () => {
    render(<StatCard icon={Wallet} label="Bugünkü satış" value="₺0,00" />);

    expect(screen.getByTestId("stat-card-icon")).toHaveAttribute("aria-hidden", "true");
  });

  it("uses the primary tone unless told otherwise", () => {
    const { rerender } = render(<StatCard icon={Wallet} label="Bugünkü satış" value="₺0,00" />);
    expect(screen.getByTestId("stat-card-icon")).toHaveAttribute("data-tone", "primary");

    rerender(<StatCard icon={Wallet} label="Bugünkü satış" value="₺0,00" tone="destructive" />);
    expect(screen.getByTestId("stat-card-icon")).toHaveAttribute("data-tone", "destructive");
  });
});

describe("StatCard icon override", () => {
  it("uses a custom tile background instead of the tone when given one, for the odd card that needs its own colour", () => {
    render(<StatCard icon={Wallet} label="Bugünkü toplam satış tutarı" value="₺0,00" iconClassName="bg-gradient-to-tr from-orange-500 to-orange-400 text-white" />);

    const icon = screen.getByTestId("stat-card-icon");
    expect(icon).toHaveClass("from-orange-500");
    expect(icon).not.toHaveAttribute("data-tone");
  });
});
