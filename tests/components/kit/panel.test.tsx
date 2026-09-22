import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Panel } from "@/components/kit/panel";

describe("Panel", () => {
  it("is a region named after its heading", () => {
    render(<Panel title="Bugün Yapılan Ödemeler">içerik</Panel>);

    const region = screen.getByRole("region", { name: "Bugün Yapılan Ödemeler" });

    expect(screen.getByRole("heading", { level: 2, name: "Bugün Yapılan Ödemeler" })).toBeInTheDocument();
    expect(region).toHaveTextContent("içerik");
  });

  it("shows the aside text next to the heading when given", () => {
    render(
      <Panel title="Günlük Satış Miktarları" aside="Tutar (₺)">
        grafik
      </Panel>
    );

    expect(screen.getByText("Tutar (₺)")).toBeInTheDocument();
  });

  it("gives two panels their own heading ids", () => {
    render(
      <>
        <Panel title="Birinci">a</Panel>
        <Panel title="İkinci">b</Panel>
      </>
    );

    expect(screen.getByRole("region", { name: "Birinci" })).toHaveTextContent("a");
    expect(screen.getByRole("region", { name: "İkinci" })).toHaveTextContent("b");
  });
});
