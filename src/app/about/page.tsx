import { AboutCtaSection } from "@/components/about/cta-section";
import { AboutHeroSection } from "@/components/about/hero-section";
import { AboutMissionSection } from "@/components/about/mission-section";
import { AboutSdgSection } from "@/components/about/sdg-section";
import { AboutTeamSection } from "@/components/about/team-section";

export default function AboutPage() {
  return (
    <div>
      <AboutHeroSection />
      <AboutMissionSection />
      <AboutSdgSection />
      <AboutTeamSection />
      <AboutCtaSection />
    </div>
  );
}
