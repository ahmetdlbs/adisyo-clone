import type { Metadata } from "next";
import { OnboardingWizard } from "@/features/onboarding/components/onboarding-wizard";

export const metadata: Metadata = {
  title: "Kurulum Sihirbazı",
  description: "Adisyo kurulumunuzu tamamlayın.",
};

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
