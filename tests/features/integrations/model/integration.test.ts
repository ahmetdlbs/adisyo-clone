import { describe, expect, it } from "vitest";
import { validateCredentials, type IntegrationField } from "@/features/integrations/model/integration";

const field = (overrides: Partial<IntegrationField>): IntegrationField => ({
  name: "apiKey",
  label: "API Key",
  secret: false,
  help: "",
  isFilled: false,
  value: null,
  ...overrides,
});

describe("validateCredentials", () => {
  const fields = [field({ name: "supplierId", label: "Satıcı ID" }), field({ name: "apiSecret", label: "API Secret", secret: true })];

  it("accepts a complete form, trimming what was typed", () => {
    expect(validateCredentials(fields, { supplierId: " 12 ", apiSecret: "s" })).toEqual({ ok: true, credentials: { supplierId: "12", apiSecret: "s" } });
  });

  it("names the first empty field", () => {
    expect(validateCredentials(fields, { supplierId: "", apiSecret: "s" })).toEqual({ ok: false, message: "Satıcı ID zorunludur" });
  });

  it("lets a stored secret stay blank, but not a stored plain field", () => {
    const stored = [field({ name: "supplierId", label: "Satıcı ID", isFilled: true }), field({ name: "apiSecret", label: "API Secret", secret: true, isFilled: true })];

    expect(validateCredentials(stored, { supplierId: "12", apiSecret: "" })).toEqual({ ok: true, credentials: { supplierId: "12", apiSecret: "" } });
    expect(validateCredentials(stored, { supplierId: "", apiSecret: "" })).toMatchObject({ ok: false });
  });

  it("requires a secret that was never stored", () => {
    expect(validateCredentials(fields, { supplierId: "1", apiSecret: " " })).toEqual({ ok: false, message: "API Secret zorunludur" });
  });
});
