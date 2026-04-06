import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, Heart, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";

import { aboutImages, heroStats } from "./about-data";
import { StatChip } from "./about-primitives";

export function AboutHeroSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(150deg,var(--about-bg-section)_0%,var(--about-accent-soft)_40%,var(--about-light-teal)_100%)] py-24">
      <div className="pointer-events-none absolute -right-24 -top-48 h-152 w-152 rounded-full bg-[radial-gradient(circle,rgba(27,107,107,0.10)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(26,150,136,0.15)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-16 px-6 lg:flex-row lg:items-center lg:px-8">
        <div className="max-w-xl flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-about-light-teal px-4 py-2 text-sm font-semibold text-about-dark-teal">
            <GraduationCap className="h-4 w-4" />
            Kelompok Cegukan · Universitas Padjadjaran
          </div>

          <h1 className="text-4xl leading-tight font-extrabold text-about-text-dark md:text-5xl">
            Mewujudkan{" "}
            <span className="text-about-dark-teal">Ruang Digital</span> yang
            Aman bagi{" "}
            <span className="bg-[linear-gradient(90deg,var(--about-dark-teal)_0%,var(--about-accent)_100%)] bg-clip-text text-transparent">
              Generasi Muda
            </span>
            .
          </h1>

          <p className="text-base leading-relaxed text-about-text-muted md:text-lg">
            TemanTumbuh adalah platform refleksi diri dan keamanan emosional
            berbasis digital untuk remaja usia{" "}
            <strong className="text-about-dark-teal">10-29 tahun</strong>. Kami
            menyediakan ruang aman untuk mengenali emosi, membangun kesadaran
            diri, dan tumbuh bersama dukungan orang terpercaya.
          </p>

          <div className="flex flex-wrap gap-4">
            {[
              { icon: Shield, label: "Privasi Terlindungi" },
              { icon: GraduationCap, label: "Berbasis Riset Akademik" },
              { icon: Heart, label: "SDG 16.2 Aligned" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="inline-flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-about-light-teal">
                  <Icon className="h-4 w-4 text-about-dark-teal" />
                </span>
                <span className="text-sm font-semibold text-about-text-dark">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              className="h-12 rounded-xl bg-[linear-gradient(135deg,var(--about-dark-teal)_0%,var(--about-accent)_100%)] px-8 text-white shadow-[0_8px_24px_rgba(27,107,107,0.30)] hover:opacity-90"
            >
              <Link href="/register">
                Mulai Sekarang <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-xl border-2 border-about-dark-teal px-8 text-about-dark-teal hover:bg-about-light-teal"
            >
              <a href="#team">Kenali Tim Kami</a>
            </Button>
          </div>
        </div>

        <div className="w-full max-w-xl flex-1 space-y-6">
          <div className="relative h-96 overflow-hidden rounded-3xl shadow-[0_24px_64px_rgba(27,107,107,0.20)]">
            <Image
              src={aboutImages.hero}
              alt="University students supportive environment"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(27,107,107,0.65)_100%)]" />
            <div className="absolute bottom-5 left-5 right-5">
              <p className="text-sm font-semibold text-white">
                Kelompok Cegukan · Informatika
              </p>
              <p className="mt-0.5 text-xs text-white/75">
                Universitas Padjadjaran
              </p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {heroStats.map((stat) => (
              <StatChip
                key={stat.label}
                value={stat.value}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
