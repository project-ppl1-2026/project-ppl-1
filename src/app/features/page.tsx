import { Metadata } from "next";
import { FeaturesHero } from "@/components/pages/features/features-hero";
import {
  FeaturesOverview,
  FeaturesDiary,
  FeaturesBraveChoice,
  FeaturesQuote,
  FeaturesPrivacy,
  FeaturesCTA,
} from "@/components/pages/features/features-sections";

export const metadata: Metadata = {
  title: "Fitur TemanTumbuh",
  description: "Ekosistem Lengkap Keamanan Emosional Kamu",
};

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden font-sans">
      <FeaturesHero />
      <FeaturesOverview />
      <FeaturesDiary />
      <FeaturesBraveChoice />
      <FeaturesQuote />
      <FeaturesPrivacy />
      <FeaturesCTA />
    </main>
  );
}
