import { describe, expect, it } from "vitest";
import { PERMISSIONS, RIGHTS_ROLES, togglePermission, type PermissionGrants } from "@/features/users/model/permission";

describe("togglePermission", () => {
  it("turns a role's grant on for a permission that had none", () => {
    const result = togglePermission({}, "table_area", "Garson");

    expect(result).toEqual({ table_area: { Garson: true } });
  });

  it("turns it back off without touching the other roles", () => {
    const grants: PermissionGrants = { table_area: { Garson: true, Müdür: true } };

    expect(togglePermission(grants, "table_area", "Garson")).toEqual({ table_area: { Garson: false, Müdür: true } });
  });

  it("does not touch another permission", () => {
    const grants: PermissionGrants = { table_area: { Garson: true }, auth_ops: { Müdür: true } };

    const result = togglePermission(grants, "table_area", "Garson");

    expect(result.auth_ops).toEqual(grants.auth_ops);
  });

  it("does not modify the object it is given", () => {
    const grants: PermissionGrants = {};

    togglePermission(grants, "table_area", "Garson");

    expect(grants).toEqual({});
  });
});

describe("PERMISSIONS and RIGHTS_ROLES", () => {
  it("lists at least one permission and one role", () => {
    expect(PERMISSIONS.length).toBeGreaterThan(0);
    expect(RIGHTS_ROLES.length).toBeGreaterThan(0);
  });

  it("gives every permission a unique id", () => {
    const ids = PERMISSIONS.map((permission) => permission.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});
