import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorState } from "@/components/kit/error-state";

describe("ErrorState", () => {
  it("announces itself as an alert with a Turkish default message", () => {
    render(<ErrorState />);

    expect(screen.getByRole("alert")).toHaveTextContent("Bir şeyler ters gitti");
    expect(screen.getByText("Beklenmedik bir hata oluştu. Tekrar deneyebilirsiniz.")).toBeInTheDocument();
  });

  it("accepts a custom title and description", () => {
    render(<ErrorState title="Yüklenemedi" description="Sunucuya ulaşılamadı." />);

    expect(screen.getByText("Yüklenemedi")).toBeInTheDocument();
    expect(screen.getByText("Sunucuya ulaşılamadı.")).toBeInTheDocument();
  });

  it("offers a retry button that runs the callback", async () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);

    await userEvent.click(screen.getByRole("button", { name: "Tekrar dene" }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("offers no retry when there is nothing to retry", () => {
    render(<ErrorState />);

    expect(screen.queryByRole("button", { name: "Tekrar dene" })).not.toBeInTheDocument();
  });
});
