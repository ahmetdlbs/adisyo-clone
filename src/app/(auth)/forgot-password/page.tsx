import ForgotPasswordView from "@/components/ForgotPasswordView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Şifremi Unuttum | Adisyo",
  description: "Adisyo şifrenizi sıfırlayın.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
