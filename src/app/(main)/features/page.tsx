import { Metadata } from "next";
import { FeaturesHero } from "@/components/features/features-hero";
import {
  FeaturesOverview,
  FeaturesDiary,
  FeaturesBraveChoice,
  FeaturesQuote,
  FeaturesPrivacy,
  FeaturesCTA,
} from "@/components/features/features-sections";

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
