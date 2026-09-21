import OnboardingWizard from "@/components/OnboardingWizard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kurulum Sihirbazı | Adisyo",
  description: "Adisyo kurulumunuzu tamamlayın.",
};

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
