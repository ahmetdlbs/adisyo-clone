import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Percent } from "lucide-react";
import { PageHeader } from "@/components/kit/page-header";

describe("PageHeader", () => {
  it("renders the title as the page heading", () => {
    render(<PageHeader title="Kdv Oranları" />);

    expect(screen.getByRole("heading", { level: 1, name: "Kdv Oranları" })).toBeInTheDocument();
  });

  it("renders the description when provided", () => {
    render(<PageHeader title="Kdv Oranları" description="En fazla 8 tanım ekleyebilirsiniz." />);

    expect(screen.getByText("En fazla 8 tanım ekleyebilirsiniz.")).toBeInTheDocument();
  });

  it("omits the description when absent", () => {
    render(<PageHeader title="Kdv Oranları" />);

    expect(screen.queryByTestId("page-header-description")).not.toBeInTheDocument();
  });

  it("renders the actions slot", () => {
    render(<PageHeader title="Kdv Oranları" actions={<button type="button">Kaydet</button>} />);

    expect(screen.getByRole("button", { name: "Kaydet" })).toBeInTheDocument();
  });

  it("hides the decorative icon from assistive tech", () => {
    render(<PageHeader title="Kdv Oranları" icon={Percent} />);

    expect(screen.getByTestId("page-header-icon")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders no icon tile when no icon is given", () => {
    render(<PageHeader title="Kdv Oranları" />);

    expect(screen.queryByTestId("page-header-icon")).not.toBeInTheDocument();
  });
});
