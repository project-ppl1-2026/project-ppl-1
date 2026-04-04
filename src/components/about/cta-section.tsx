import Link from "next/link";
import { ArrowRight, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AboutCtaSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(145deg,var(--about-dark-teal)_0%,#0D5050_40%,var(--about-accent)_100%)] py-24 text-white">
      <div className="pointer-events-none absolute -left-24 -top-48 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-24 -right-12 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-4xl space-y-8 px-6 text-center lg:px-8">
        <p className="inline-flex rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold">
          MULAI PERJALANANMU
        </p>

        <h2 className="text-4xl leading-tight font-bold md:text-5xl">
          Mari Tumbuh Bersama.
          <br />
          Mulai Perjalananmu Sekarang.
        </h2>

        <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/85">
          Bergabunglah dengan ribuan remaja yang sudah merasakan manfaat
          TemanTumbuh. Gratis selamanya untuk fitur dasar, karena kesehatan
          emosional adalah hak setiap generasi muda.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button
            asChild
            className="h-14 rounded-2xl bg-white px-10 font-bold text-about-dark-teal shadow-[0_8px_32px_rgba(0,0,0,0.20)] hover:bg-white/95"
          >
            <Link href="/register">
              Daftar Gratis Sekarang <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-14 rounded-2xl border-white/50 px-10 text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/">Lihat Platform</Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 pt-2 text-sm text-white/75">
          <a
            href="mailto:TemanTumbuh@gmail.com"
            className="inline-flex items-center gap-2 hover:opacity-90"
          >
            <Mail className="h-4 w-4" />
            TemanTumbuh@gmail.com
          </a>
          <span className="hidden h-4 w-px bg-white/30 sm:block" />
          <span className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-white/90">
            <Lock className="h-4 w-4" />
            Privasi Terlindungi Penuh
          </span>
          <span className="hidden h-4 w-px bg-white/30 sm:block" />
          <span className="text-white/65">
            © 2025 TemanTumbuh · Kelompok Cegukan · UNPAD
          </span>
        </div>
      </div>
    </section>
  );
}
