import type { Metadata } from "next";
import { UsersScreen } from "@/features/users/components/users-screen";
import { listStaff } from "@/features/users/server/actions";

export const metadata: Metadata = { title: "Kullanıcılar" };

export default async function UsersPage() {
  const users = await listStaff();
  return <UsersScreen users={users} />;
}
