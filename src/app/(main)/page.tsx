import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { PurposeSection } from "@/components/landing/purpose-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { CTASection } from "@/components/landing/cta-section";

// ============================================================
// src/app/(main)/page.tsx - TemanTumbuh Landing Page
// ============================================================

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <main className="flex-1">
        <section id="hero">
          <HeroSection />
        </section>
        <section id="features">
          <FeaturesSection />
        </section>
        <section id="purpose">
          <PurposeSection />
        </section>
        <section id="how">
          <HowItWorksSection />
        </section>
        <section id="testi">
          <TestimonialsSection />
        </section>
        <CTASection />
      </main>
    </div>
  );
}
