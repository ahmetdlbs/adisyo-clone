import { describe, expect, it } from "vitest";
import { NAVIGATION } from "@/config/navigation";
import { ROUTES } from "@/config/routes";
import { findActiveGroup, isRouteActive } from "@/components/shell/nav-utils";

describe("isRouteActive", () => {
  it("matches the exact path", () => {
    expect(isRouteActive("/dashboard", "/dashboard")).toBe(true);
  });

  it("matches nested paths under the href", () => {
    expect(isRouteActive("/kitchen-detail/98012", "/kitchen-detail")).toBe(true);
  });

  it("does not match a sibling that only shares a prefix", () => {
    expect(isRouteActive("/report-sales-products", "/reports")).toBe(false);
    expect(isRouteActive("/orders-archive", "/orders")).toBe(false);
  });

  it("does not match unrelated paths", () => {
    expect(isRouteActive("/users", "/dashboard")).toBe(false);
  });
});

describe("findActiveGroup", () => {
  it("returns the group that contains the active page", () => {
    expect(findActiveGroup(ROUTES.vatDefinitions, NAVIGATION)?.label).toBe("Tanımlamalar");
    expect(findActiveGroup(ROUTES.reports, NAVIGATION)?.label).toBe("Raporlar");
  });

  it("returns undefined for a top-level link", () => {
    expect(findActiveGroup(ROUTES.orders, NAVIGATION)).toBeUndefined();
  });

  it("returns undefined for an unknown path", () => {
    expect(findActiveGroup("/nope", NAVIGATION)).toBeUndefined();
  });
});
