import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageBody, PageCard, PageContainer, PageToolbar } from "@/components/kit/page";

describe("page layout", () => {
  it("lays out a toolbar row with its children", () => {
    render(
      <PageToolbar>
        <span>Arama</span>
        <button type="button">Yeni</button>
      </PageToolbar>
    );

    expect(screen.getByText("Arama")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Yeni" })).toBeInTheDocument();
  });

  it("renders the whole page skeleton", () => {
    render(
      <PageContainer>
        <PageCard>
          <PageBody>İçerik</PageBody>
        </PageCard>
      </PageContainer>
    );

    expect(screen.getByText("İçerik")).toBeInTheDocument();
  });

  it("merges a custom className on the card", () => {
    render(<PageCard className="border-primary">Kart</PageCard>);

    expect(screen.getByText("Kart")).toHaveClass("border-primary");
  });

  it("makes the body the scrolling region", () => {
    render(<PageBody>Gövde</PageBody>);

    expect(screen.getByText("Gövde")).toHaveClass("overflow-auto");
  });
});
