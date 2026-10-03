import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Şifremi Unuttum",
  description: "Adisyon Merkezi şifrenizi sıfırlayın.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
