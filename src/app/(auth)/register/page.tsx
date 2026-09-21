import RegisterView from "@/components/RegisterView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kayıt Ol | Adisyo",
  description: "Adisyo'ya hemen kaydolun, 15 gün boyunca ücretsiz deneyin!",
};

export default function RegisterPage() {
  return <RegisterView />;
}
