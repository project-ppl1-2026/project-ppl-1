import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Heart, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";

import { aboutImages, heroStats } from "./about-data";
import { StatChip } from "./about-primitives";

export function AboutHeroSection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-16 px-6 lg:flex-row lg:items-center lg:px-8">
        <div className="max-w-xl flex-1 space-y-8">
          <h1 className="text-4xl leading-tight font-extrabold text-text-brand-primary md:text-5xl">
            Mewujudkan{" "}
            <span className="text-brand-teal-dark">Ruang Digital</span> yang
            Aman bagi{" "}
            <span className="bg-[linear-gradient(90deg,var(--color-brand-teal-dark)_0%,var(--color-brand-teal)_100%)] bg-clip-text text-transparent">
              Generasi Muda
            </span>
            .
          </h1>

          <p className="text-base leading-relaxed text-text-brand-secondary md:text-lg">
            TemanTumbuh adalah platform refleksi diri dan keamanan emosional
            berbasis digital untuk remaja usia{" "}
            <strong className="text-brand-teal-dark">10-29 tahun</strong>. Kami
            menyediakan ruang aman untuk mengenali emosi, membangun kesadaran
            diri, dan tumbuh bersama dukungan orang terpercaya.
          </p>

          <div className="flex flex-wrap gap-5">
            {[
              { icon: Shield, label: "Privasi Terlindungi" },
              { icon: GraduationCap, label: "Berbasis Riset Akademik" },
              { icon: Heart, label: "SDG 16.2 Aligned" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="inline-flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center">
                  <Icon className="h-4 w-4 text-brand-teal-dark" />
                </span>
                <span className="text-sm font-semibold text-text-brand-primary">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              className="h-12 rounded-xl bg-[linear-gradient(135deg,var(--color-brand-teal-dark)_0%,var(--color-brand-teal)_100%)] px-8 text-white hover:opacity-90"
            >
              <Link href="/register">Mulai Sekarang</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-xl border-2 px-8 bg-white text-brand-teal-dark hover:bg-brand-teal/1 hover:text-brand-teal-dark"
            >
              <a href="#team">Kenali Tim Kami</a>
            </Button>
          </div>
        </div>

        <div className="w-full max-w-xl flex-1 space-y-6">
          <div className="relative h-96 overflow-hidden rounded-3xl">
            <Image
              src={aboutImages.hero}
              alt="University students supportive environment"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,black_120%)]" />
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
