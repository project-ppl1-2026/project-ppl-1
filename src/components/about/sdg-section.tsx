import { BookOpen, CheckCircle2, Globe, Scale, Target } from "lucide-react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";

import { impactStats, sdgPoints } from "./about-data";
import { SectionHeader } from "./about-primitives";

const sdgIcons = {
  book: BookOpen,
  target: Target,
  globe: Globe,
};

function SdgBadge() {
  return (
    <Card className="w-full max-w-xs border-about-light-teal bg-card shadow-[0_8px_32px_rgba(26,61,124,0.22)]">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#1A3D7C_0%,#1E4FA0_100%)] text-white">
          <Scale className="h-8 w-8" />
        </div>
        <div>
          <p className="text-sm font-extrabold tracking-wide text-about-text-dark">
            SDG 16
          </p>
          <p className="text-xs font-medium text-about-text-muted">
            Peace & Justice
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function AboutSdgSection() {
  return (
    <section className="bg-about-bg-section py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          label="KOMITMEN GLOBAL"
          title="Komitmen Kami Terhadap SDG 16.2"
          description="TemanTumbuh mendukung penghapusan penyalahgunaan, eksploitasi, dan kekerasan terhadap anak melalui pendekatan teknologi yang aman."
        />

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <div className="flex w-full flex-col items-center gap-6 lg:max-w-sm">
            <SdgBadge />

            <Card className="w-full border-about-light-teal bg-card shadow-[0_8px_28px_rgba(27,107,107,0.14)]">
              <CardContent className="space-y-3 p-6">
                <CardTitle className="text-sm text-about-text-dark">
                  SDG Goal 16 - Peace, Justice and Strong Institutions
                </CardTitle>
                <p className="text-xs leading-relaxed text-about-text-muted">
                  Target 16.2 berfokus pada penghentian penyalahgunaan,
                  eksploitasi, perdagangan orang, dan semua bentuk kekerasan
                  terhadap anak.
                </p>
                <div className="h-0.5 rounded-full bg-[linear-gradient(90deg,var(--about-dark-teal),var(--about-accent))]" />
                <p className="inline-flex items-center gap-2 text-xs font-semibold text-about-accent">
                  <CheckCircle2 className="h-4 w-4" />
                  TemanTumbuh selaras dengan target ini
                </p>
              </CardContent>
            </Card>

            <Card className="w-full border-none bg-[linear-gradient(145deg,var(--about-dark-teal)_0%,var(--about-accent)_100%)] text-white shadow-[0_8px_32px_rgba(27,107,107,0.28)]">
              <CardContent className="space-y-4 p-6">
                <p className="text-sm font-bold">Dampak yang Dituju</p>
                {impactStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-white/75">{stat.label}</span>
                    <span className="text-sm font-bold">{stat.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="flex-1 space-y-6">
            {sdgPoints.map((point) => {
              const Icon = sdgIcons[point.icon];
              return (
                <Card
                  key={point.title}
                  className="border-about-light-teal bg-card shadow-[0_8px_28px_rgba(27,107,107,0.12)]"
                >
                  <CardContent className="flex gap-5 p-7">
                    <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-about-light-teal">
                      <Icon className="h-5 w-5 text-about-dark-teal" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-bold text-about-text-dark">
                        {point.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-about-text-muted">
                        {point.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <Card className="border-about-light-teal bg-about-light-teal">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-about-dark-teal text-white">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="mb-1 text-sm font-bold text-about-text-dark">
                    Didesain dengan Prinsip Privacy-by-Design
                  </p>
                  <p className="text-xs leading-relaxed text-about-text-muted">
                    Arsitektur TemanTumbuh dirancang dari awal untuk melindungi
                    data pengguna. Tidak ada data identitas pribadi dibagikan
                    tanpa persetujuan eksplisit.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
