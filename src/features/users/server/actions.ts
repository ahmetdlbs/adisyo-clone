"use server";

import { revalidatePath } from "next/cache";
import { ROUTES } from "@/config/routes";
import { ApiError, apiFetch } from "@/lib/api-client";
import type { PermissionGrants } from "../model/permission";
import type { User, UserFormValues, UserRole } from "../model/user";

/** Wire shape of GET/POST api/'s `/staff` — see api/src/staff/staff.service.ts PublicStaffMember. */
interface ApiStaffMember {
  id: string;
  no: number;
  name: string;
  email: string;
  phone: string;
  role: "MANAGER" | "CASHIER" | "WAITER";
  region: string;
  callerId: boolean;
  blockLogin: boolean;
  usePin: boolean;
  lastLogin: string | null;
}

// The screen's role labels are Turkish (USER_ROLES); api/'s StaffRole enum is English. This is the one
// place the two sides are translated, so the UI never has to change and the API stays a proper enum.
const ROLE_TO_API: Record<UserRole, ApiStaffMember["role"]> = {
  Yönetici: "MANAGER",
  Kasiyer: "CASHIER",
  Garson: "WAITER",
};
const ROLE_FROM_API: Record<ApiStaffMember["role"], UserRole> = {
  MANAGER: "Yönetici",
  CASHIER: "Kasiyer",
  WAITER: "Garson",
};

const toUser = (staff: ApiStaffMember): User => ({ ...staff, role: ROLE_FROM_API[staff.role] });

export async function listStaff(): Promise<User[]> {
  const staff = await apiFetch<ApiStaffMember[]>("/staff");
  return staff.map(toUser);
}

/** Adds a staff member. Throws (message meant for the phone field) when the phone number is already taken. */
export async function createStaffMember(values: UserFormValues): Promise<User> {
  try {
    const staff = await apiFetch<ApiStaffMember>("/staff", {
      method: "POST",
      body: { ...values, role: ROLE_TO_API[values.role] },
    });
    revalidatePath(ROUTES.users);
    return toUser(staff);
  } catch (error) {
    throw error instanceof ApiError ? new Error(error.message) : new Error("Kullanıcı eklenemedi");
  }
}

/** Replaces the whole permission grid — matches the "Haklar" screen's "Kaydet commits it all" behaviour. */
export async function saveGrants(grants: PermissionGrants): Promise<PermissionGrants> {
  try {
    const saved = await apiFetch<PermissionGrants>("/rights", { method: "PUT", body: { grants } });
    revalidatePath(ROUTES.rights);
    return saved;
  } catch (error) {
    throw error instanceof ApiError ? new Error(error.message) : new Error("Yetkiler kaydedilemedi");
  }
}
