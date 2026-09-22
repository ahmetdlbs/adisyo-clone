// @vitest-environment node
import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { NAVIGATION, isNavGroup } from "@/config/navigation";
import { ROUTES } from "@/config/routes";

const APP_DIR = fileURLToPath(new URL("../../src/app", import.meta.url));
const ROUTE_GROUP = /^\(.+\)$/;

/** URL paths of every `page.tsx` under src/app; `(group)` folders do not appear in URLs. */
function collectPageRoutes(dir: string, segments: readonly string[] = []): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) {
      const next = ROUTE_GROUP.test(entry.name) ? segments : [...segments, entry.name];
      return collectPageRoutes(path.join(dir, entry.name), next);
    }
    return entry.name === "page.tsx" ? [`/${segments.join("/")}`] : [];
  });
}

const pageRoutes = new Set(collectPageRoutes(APP_DIR));
const navHrefs = NAVIGATION.flatMap((entry) => (isNavGroup(entry) ? entry.children : [entry]))
  .map((link) => link.href)
  .filter((href): href is NonNullable<typeof href> => href !== undefined);

describe("ROUTES", () => {
  it.each(Object.entries(ROUTES))("%s (%s) has a page.tsx", (_name, href) => {
    expect(pageRoutes.has(href)).toBe(true);
  });

  it("has unique paths", () => {
    const values = Object.values(ROUTES);
    expect(new Set(values).size).toBe(values.length);
  });
});

describe("NAVIGATION", () => {
  it("only links to pages that exist", () => {
    const missing = navHrefs.filter((href) => !pageRoutes.has(href));
    expect(missing).toEqual([]);
  });

  it("does not list a destination twice", () => {
    expect(new Set(navHrefs).size).toBe(navHrefs.length);
  });

  it("gives every group at least one child", () => {
    const emptyGroups = NAVIGATION.filter(isNavGroup).filter((group) => group.children.length === 0);
    expect(emptyGroups).toEqual([]);
  });
});
