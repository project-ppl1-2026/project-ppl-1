import Image from "next/image";
import { BookOpen, Lightbulb, Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { aboutImages, missions } from "./about-data";
import { IconCard, SectionHeader } from "./about-primitives";

const missionIcons = {
  lightbulb: Lightbulb,
  book: BookOpen,
  shield: Shield,
};

export function AboutMissionSection() {
  return (
    <section className="bg-card py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          label="PILAR UTAMA KAMI"
          title="Misi & Nilai TemanTumbuh"
          description="Tiga pilar yang menjadi fondasi setiap fitur dan keputusan desain platform kami."
        />

        <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
          {missions.map((mission) => (
            <IconCard
              key={mission.title}
              icon={missionIcons[mission.icon]}
              title={mission.title}
              desc={mission.desc}
              tag={mission.tag}
            />
          ))}
        </div>

        <Card className="mt-16 overflow-hidden border-none bg-[linear-gradient(135deg,var(--color-brand-teal-dark)_0%,#0D5A5A_50%,var(--color-brand-teal)_100%)] text-white shadow-[0_16px_56px_rgba(27,107,107,0.28)]">
          <div className="flex flex-col lg:flex-row">
            <CardContent className="z-10 flex-1 space-y-6 p-10 lg:p-14">
              <Badge className="rounded-full bg-white/20 px-4 py-1.5 text-white hover:bg-white/20">
                VISI KAMI
              </Badge>
              <h3 className="text-3xl leading-tight font-bold">
                Setiap Remaja Berhak Tumbuh dengan Aman dan Percaya Diri
              </h3>
              <p className="text-sm leading-relaxed text-white/80">
                TemanTumbuh lahir dari keprihatinan terhadap meningkatnya
                kekerasan emosional dan sosial pada remaja Indonesia. Kami
                percaya teknologi yang dirancang dengan tepat dapat menjadi
                teman setia dalam proses tumbuh kembang.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  "Privasi Pertama",
                  "Inklusif & Aksesibel",
                  "Evidence-Based",
                  "Lokal & Kontekstual",
                ].map((tag) => (
                  <Badge
                    key={tag}
                    className="rounded-xl bg-white/15 px-3 py-1.5 text-white hover:bg-white/15"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <div className="relative min-h-64 flex-1">
              <Image
                src={aboutImages.youth}
                alt="Youth wellbeing"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-70"
                unoptimized
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-brand-teal-dark)_0%,transparent_40%)]" />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
