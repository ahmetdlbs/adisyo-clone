import type { Metadata } from "next";
import { ProfileScreen } from "@/features/profile/components/profile-screen";

export const metadata: Metadata = { title: "Profil" };

export default function ProfilePage() {
  return <ProfileScreen initialProfile={{ firstName: "Ahmet", lastName: "Yönetici", phone: "0544 307 11 60", email: "ahmet@isletme.local", pin: "" }} />;
}
