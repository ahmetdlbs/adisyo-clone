import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { RegisterForm } from "@/features/auth/components/register-form";
import { RegisterHero } from "@/features/auth/components/register-hero";

export const metadata: Metadata = {
  title: "Kayıt Ol",
  description: "Adisyon Merkezi'ne hemen kaydolun, 15 gün boyunca ücretsiz deneyin!",
};

export default function RegisterPage() {
  return (
    <AuthLayout aside={<RegisterHero />}>
      <RegisterForm />
    </AuthLayout>
  );
}
