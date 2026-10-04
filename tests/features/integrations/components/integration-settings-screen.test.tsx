import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IntegrationSettingsScreen } from "@/features/integrations/components/integration-settings-screen";
import type { Integration } from "@/features/integrations/model/integration";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));
const actions = vi.hoisted(() => ({ saveIntegration: vi.fn(), disconnectIntegration: vi.fn() }));
vi.mock("@/features/integrations/server/actions", () => actions);

beforeEach(() => {
  Object.values(toast).forEach((mock) => mock.mockClear());
  Object.values(actions).forEach((mock) => mock.mockReset());
});

const trendyol = (overrides: Partial<Integration> = {}): Integration => ({
  provider: "trendyol",
  label: "Trendyol Yemek",
  appKey: "trendyol-yemek-entegrasyonu",
  isAppActive: true,
  status: "DISCONNECTED",
  connectedAt: null,
  fields: [
    { name: "supplierId", label: "Satıcı ID", secret: false, help: "yardım", isFilled: false, value: null },
    { name: "apiSecret", label: "API Secret", secret: true, help: "gizli", isFilled: false, value: null },
  ],
  ...overrides,
});

const card = (name: string) => within(screen.getByRole("region", { name }));

describe("IntegrationSettingsScreen", () => {
  it("sends a restaurant that has not bought the app to the store instead of showing a form", () => {
    render(<IntegrationSettingsScreen integrations={[trendyol({ isAppActive: false })]} />);

    expect(card("Trendyol Yemek").getByRole("link", { name: "Mağazaya git" })).toHaveAttribute("href", "/app-store?need=trendyol-yemek-entegrasyonu");
    expect(card("Trendyol Yemek").queryByRole("button", { name: "Kaydet" })).not.toBeInTheDocument();
  });

  it("saves the typed credentials", async () => {
    actions.saveIntegration.mockResolvedValue(trendyol());
    const user = userEvent.setup();
    render(<IntegrationSettingsScreen integrations={[trendyol()]} />);

    await user.type(screen.getByLabelText("Satıcı ID"), "1234");
    await user.type(screen.getByLabelText("API Secret"), "shh");
    await user.click(screen.getByRole("button", { name: "Kaydet" }));

    await waitFor(() => expect(actions.saveIntegration).toHaveBeenCalledWith("trendyol", { supplierId: "1234", apiSecret: "shh" }));
    expect(toast.success).toHaveBeenCalledWith("Bağlantı bilgileri kaydedildi");
  });

  it("names the missing field and does not call the server", async () => {
    const user = userEvent.setup();
    render(<IntegrationSettingsScreen integrations={[trendyol()]} />);

    await user.click(screen.getByRole("button", { name: "Kaydet" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Satıcı ID zorunludur");
    expect(actions.saveIntegration).not.toHaveBeenCalled();
  });

  it("shows the API's reason when saving fails", async () => {
    actions.saveIntegration.mockRejectedValue(new Error("Bu özellik için uygulamayı edinmelisiniz"));
    const user = userEvent.setup();
    render(<IntegrationSettingsScreen integrations={[trendyol()]} />);

    await user.type(screen.getByLabelText("Satıcı ID"), "1");
    await user.type(screen.getByLabelText("API Secret"), "s");
    await user.click(screen.getByRole("button", { name: "Kaydet" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("uygulamayı edinmelisiniz");
  });

  it("shows a saved connection as waiting for activation, never revealing the secret", () => {
    render(
      <IntegrationSettingsScreen
        integrations={[
          trendyol({
            status: "PENDING",
            fields: [
              { name: "supplierId", label: "Satıcı ID", secret: false, help: "", isFilled: true, value: "1234" },
              { name: "apiSecret", label: "API Secret", secret: true, help: "", isFilled: true, value: null },
            ],
          }),
        ]}
      />
    );

    expect(screen.getByText("Aktivasyon bekliyor")).toBeInTheDocument();
    expect(screen.getByLabelText("Satıcı ID")).toHaveValue("1234");
    expect(screen.getByLabelText("API Secret")).toHaveValue("");
    expect(screen.getByPlaceholderText("Kayıtlı — değiştirmek için yazın")).toBeInTheDocument();
  });

  it("removes a connection", async () => {
    actions.disconnectIntegration.mockResolvedValue(trendyol());
    const user = userEvent.setup();
    render(<IntegrationSettingsScreen integrations={[trendyol({ status: "PENDING" })]} />);

    await user.click(screen.getByRole("button", { name: "Bağlantıyı kaldır" }));

    await waitFor(() => expect(actions.disconnectIntegration).toHaveBeenCalledWith("trendyol"));
    expect(toast.success).toHaveBeenCalledWith("Bağlantı kaldırıldı");
  });
});
