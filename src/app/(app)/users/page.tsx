import type { Metadata } from "next";
import { UsersScreen } from "@/features/users/components/users-screen";

export const metadata: Metadata = { title: "Kullanıcılar" };

export default function UsersPage() {
  return <UsersScreen />;
}
